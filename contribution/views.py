import os
import sys
from datetime import datetime, timedelta

from django.conf import settings
from django.shortcuts import render
from django.views.decorators.http import require_safe
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

sys.path.append(settings.PROJECT_PATH)

from lib.main.common.granary import Granary
from lib.main.core.pitdatabase import TASK_PASS, TASK_PENDING, TASK_RUNNING, TASK_FAIL, Database


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
    pit_db = Database()
    data = pit_db.list_tasks(email_address=request.user.email)
    farmer = {
        'data': [],
        'pass': 0,
    }
    page_crawler = {
        'data': [],
        'pass': 0,
    }
    rss = {
        'data': [],
        'pass': 0,
    }
    unique_list = []
    if data:
        for dat in data:
            dat = dat.to_dict()
            if dat['sha1'] in unique_list:
                continue

            dat['pattern_file'] = os.path.basename(dat['pattern_file'])

            if dat['pattern_type'].lower() == 'farmer':
                farmer['data'].append(dat)
                if dat['status'].lower() == 'pass':
                    farmer['pass'] += 1
            elif dat['pattern_type'].lower() == 'page_crawler':
                page_crawler['data'].append(dat)
                if dat['status'].lower() == 'pass':
                    page_crawler['pass'] += 1
            elif dat['pattern_type'].lower() == 'rss':
                rss['data'].append(dat)
                if dat['status'].lower() == 'pass':
                    rss['pass'] += 1

            unique_list.append(dat['sha1'])

    return render(request, "contribution/index.html",
                            {
                                "results": {
                                    'farmer': farmer,
                                    'rss': rss,
                                    'page_crawler': page_crawler
                                },
                                "navigation": "contribution",
                                "error": None,
                                "login": request.user.is_authenticated(),
                            }
                  )
