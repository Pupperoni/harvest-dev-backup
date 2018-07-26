from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from lib.main.common.abstracts import PageCrawler
from lib.main.common.config import Config
from lib.main.common.granary import Granary
from lib.main.common.utils import unix_time_millis

from datetime import datetime, timedelta
import json

cfg = Config("main").get('main')

# Conditional decorator for web authentication
class conditional_login_required(object):
    def __init__(self, dec, condition):
        self.decorator = dec
        self.condition = condition
    def __call__(self, func):
        if not self.condition:
            return func
        return self.decorator(func)


@conditional_login_required(login_required, settings.WEB_AUTHENTICATION)
def verifySite(request):
    message = None
    headers = None
    error = None
    if request.method == 'POST':
        pattern_list = []
        pattern_data = json.loads(request.POST.get('builder-data'))
        crawler = PageCrawler()
        crawler.set_options(cfg)
        crawler.set_driver()

        """Attempt to visit the URL"""
        try:
            crawler.driver.get(pattern_data['url'])
        except:
            message = "Cannot visit URL!"
            error = True
            return render(request, 'granarytools/verifySite.html',
                {
                    'login': request.user.is_authenticated(),
                    'error': error,
                    'message': message,
                }
            )
        
        """Create list with same format as pattern list in Harvest"""
        pattern_list_meta = pattern_data['rules']
        for item in pattern_list_meta:
            pattern_item = {}
            for field in item['rules']:
                if field['id'] == 'action':
                    pattern_item[field['id']] = field['value'].lower()
                elif field['id'] == 'user_agent':
                    pattern_item[field['id']] = True
                elif field['id'] == 'referrer':
                    pattern_item['referer'] = field['value']
                else:
                    pattern_item[field['id']] = field['value']
            pattern_list.append(pattern_item)

        headers = []
        '''Attempt to get headers from xpaths'''
        for item in pattern_list:
            referrer = None
            user_agent = None
            if 'referer' in item:
                referrer = item['referer']
            if 'user_agent' in item:
                user_agent = item['user_agent']
            urls = crawler.get_url(xpath=item['xpath'])
            for url in urls:
                crawler.sleep(1, crawler.sleep_ceiling)
                header = crawler.page_actions(url=url['url'], action=item['action'], referer=referrer, user_agent=user_agent)
                if header:  # can be NoneType which we should ignore
                    headers.append(header)

        """After looking for headers"""
        if len(headers) != 0:
            message = "Pattern successful at " + pattern_data['url']
            for header in headers:
                '''Restructure dictionary to render in html'''
                header['contentlength'] = header.pop('Content-Length')
                header['contenttype'] = header.pop('Content-Type')
                header['lastmodified'] = header.pop('Last-Modified')
        else:          
            message = "Failed to get headers"
            error = True
            headers = None

    return render(request, 'granarytools/verifySite.html',
                {
                    'login': request.user.is_authenticated(),
                    'error': error,
                    'message': message,
                    'headers': headers
                }
            )

@conditional_login_required(login_required, settings.WEB_AUTHENTICATION)
def pendingDownloads(request):
    pages = []
    gran = Granary()
    pending_downloads = gran.get_pending_download()

    if pending_downloads != None:
        """Restructure dictionary to contain the domain name"""
        for entry in pending_downloads:
            domName = gran.get_domain_by_id(entry['domainId'])
            pages.append({'domainId':entry['domainId'], 'cnt':entry['cnt'], 'domainName':domName['url']})

    return render(request, 'granarytools/pendingDownloads.html',
                {
                    'pages': pages,
                    "login": request.user.is_authenticated()
                }
            )

@conditional_login_required(login_required, settings.WEB_AUTHENTICATION)
def resetpages(request):
    all_domains = []
    gran = Granary()
    domain_list = gran.get_domain_list()
    if domain_list != None:
        for domain in domain_list:
            all_domains.append({'id':domain['id'],'url':domain['url']})
    data = None
    if request.method == 'POST':
        ''' Check if domain id was selected '''
        if 'domain_id' in request.POST and request.POST.get('domain_id') != '0':
            data = {}
            domainid = request.POST.get('domain_id')
            response = gran.get_domain_by_id(domainid)
            data['domain'] = {}
            data['domain']['name'] = response['url'].title()
            data['domain']['id'] = response['id']

        else:
            return render(request,'granarytools/resetpages.html',
                        {
                            'results':{
                                'all_domains':all_domains,
                                'data':data,
                            },
                            "error": "Failed to retrieve domain id",
                            "login": request.user.is_authenticated()
                        })
        
        ''' Check if time frame was selected '''
        if 'reset_pages' in request.POST and request.POST.get('reset_pages') != '-1':
            if request.POST.get('reset_pages') == 'all':
                ''' Proceed to reset all pages of domain '''
                gran.reset_pages(domainid=domainid) 

            elif str.isdigit(str(request.POST.get('reset_pages'))):
                offset = timedelta(days=-int(request.POST.get('reset_pages')))
                startDate = unix_time_millis(datetime.today().replace(hour=0,minute=0,second=0,microsecond=0) + offset)
                endDate = unix_time_millis(datetime.today().replace(hour=23,minute=59,second=59,microsecond=999999) + offset)
                ''' Reset only pages between startDate and endDate '''
                gran.reset_pages(domainid=domainid,startDate=startDate,endDate=endDate)
            
            else:
                return render(request,'granarytools/resetpages.html',{
                                'results':{
                                    'all_domains':all_domains,
                                    'data':data,
                                },
                                "error":"Failed to retrieve time frame",
                                "login": request.user.is_authenticated()
                            })

        else:
            return render(request,'granarytools/resetpages.html',{
                                'results':{
                                    'all_domains':all_domains,
                                    'data':data,
                                },
                                "error":"Failed to retrieve time frame",
                                "login": request.user.is_authenticated()
                                })

        response = gran.get_last_page(domainid, page_count=20)
        if response:
            page_list = []
            for page in response:
                new = {}
                new['id'] = page['id']
                new['url'] = page['url']
                new['status'] = page['status']
                new['version'] = page['version']
                new['meta'] = page['meta']

                new['created'] = datetime.fromtimestamp(page["created"]/1000)
                if page["lastChecked"]:
                    new['last_checked'] = datetime.fromtimestamp(page["lastChecked"]/1000)
                else:
                    new['last_checked'] = None

                page_list.append(new)

            data["page"] = page_list
        
    return render(request,'granarytools/resetpages.html',{
                                'results':{
                                    'all_domains':all_domains,
                                    'data':data,
                                },
                                "error":None,
                                "login": request.user.is_authenticated()
                                })

@conditional_login_required(login_required, settings.WEB_AUTHENTICATION)
def updateStatus(request):
    if request.method == 'GET':
        all_domains = []
        gran = Granary()
        domain_list = gran.get_domain_list()
        if domain_list != None:
            for domain in domain_list:
                all_domains.append({'id':domain['id'],'url':domain['url']})
        return render(request,'granarytools/updateStatus.html',{
                                    'all_domains':all_domains,
                                    "login": request.user.is_authenticated()
                                    })
    
    elif request.method == 'POST':
        gran = Granary()

        """ See if a domain_id was sent """
        if 'domain_id' in request.POST and request.POST.get('domain_id') != '0':
            domain_id = int(request.POST.get('domain_id'))
        else:
            return render(request,'granarytools/updateStatus.html', {
                                        'message':'Failed to retrieve Domain ID',
                                        "login": request.user.is_authenticated()
                                        })

        """ See if a new status was selected """
        if 'status' in request.POST:
            status = request.POST.get('status')
        else:
            return render(request,'granarytools/updateStatus.html', {
                                        'message':'Failed to retrieve Status',
                                        "login": request.user.is_authenticated()
                                        })
        
        """ Update page status """ # Need to get list of pages of the domain
        gran.update_status(page_id=domain_id,status=status)
        return render(request, 'granarytools/updateStatus.html', {
                                    'message':'Success',
                                    "login": request.user.is_authenticated()
                                    })

@conditional_login_required(login_required, settings.WEB_AUTHENTICATION)
def domainList(request):
    gran = Granary()
    domain_list = gran.get_domain_list()
    """Restructure dictionary"""
    domains = []
    if domain_list:
        for domain in domain_list:
            domains.append({"id":domain['id'], "url":domain['url'].encode('utf-8')})

    return render(request,'granarytools/domains.html', {
                                'domains':domains,
                                'login': request.user.is_authenticated()
                                })