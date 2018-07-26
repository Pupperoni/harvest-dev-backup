
import sys
from datetime import datetime, timedelta

from django.conf import settings
from django.shortcuts import render
from django.views.decorators.http import require_safe
from django.contrib.auth.decorators import login_required

sys.path.append(settings.PROJECT_PATH)

from lib.main.common.granary import Granary

granary_obj = Granary()


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
def index(request):
    domain_list = granary_obj.get_domain_list()
    if not domain_list:
        domain_list = []
    domain_list_url = []
    for domain in domain_list:
        if domain['url'] not in domain_list_url:
            domain_list_url.append(str(domain['url']))

    """Pre-format"""
    domain_list_url = str(domain_list_url)
    domain_list_url =  domain_list_url.replace("'", "\"")

    data = None
    if request.method == "POST":
        domain_name = request.POST.get("domain_name", None)
        if domain_name:
            data = {}
            response = granary_obj.get_domain(domain_name)
            if response:
                data["domain"] = {}
                data["domain"]["name"] = response['url'].title()
                data["domain"]["id"] = response['id']
            else:
                return render(request, "search/index.html",
                              {
                                  "results": {
                                      "domain_list": domain_list_url,
                                      "data": data
                                  },
                                  "navigation": "tester",
                                  "error": "No data for Domain[{}] found.".format(domain_name),
                                  "login": request.user.is_authenticated(),
                              }
                              )

            response = granary_obj.get_last_page(response['id'], page_count=10)
            if response:
                page_list = []
                for page in response:
                    new = {}
                    new['id'] = page['id']
                    new['url'] = page['url']
                    new['status'] = page['status']
                    new['version'] = page['version']
                    new['meta'] = page['meta']
                    new['file_download_meta'] = granary_obj.get_file_download_meta(page['id'])

                    new['created'] = datetime.fromtimestamp(page["created"]/1000)
                    if page["lastChecked"]:
                        new['last_checked'] = datetime.fromtimestamp(page["lastChecked"]/1000)
                    else:
                        new['last_checked'] = None

                    page_list.append(new)

                data["page"] = page_list
                
    return render(request, "search/index.html",
                            {
                                "results": {
                                    "domain_list": domain_list_url,
                                    "data": data
                                },
                                "navigation": "tester",
                                "error": None,
                                "login": request.user.is_authenticated(),
                            }
                )