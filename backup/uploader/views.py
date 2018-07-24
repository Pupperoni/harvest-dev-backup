import os
import sys

from django.shortcuts import render
from django.conf import settings

from django.views.decorators.http import require_safe
from django.contrib.auth.decorators import login_required
from lib.main.common.utils import store_temp_file
from lib.main.common.objects import File
from lib.main.core.pitdatabase import Database

try:
    from pylint import epylint as lint
    LINT_MODE = True
except ImportError:
    LINT_MODE = False

# Create your views here.
sys.path.append(settings.PROJECT_PATH)

# Conditional decorator for web authentication
class conditional_login_required(object):
    def __init__(self, dec, condition):
        self.decorator = dec
        self.condition = condition
    def __call__(self, func):
        if not self.condition:
            return func
        return self.decorator(func)


def check_syntax(pattern_file):
    data = {}
    if LINT_MODE:
        pattern_file = pattern_file.replace("\\", "\\\\")
        (pylint_stdout, pylint_stderr) = lint.py_run(pattern_file, return_std=True)

        data['lint'] = []
        for message in pylint_stdout.buf.split(b'\n'):
            if message:
                if 'error' in message:
                    data['lint'].append(message.strip())

        with open(pattern_file, 'r') as fHandle:
            pattern_content = fHandle.read()
            data['pattern_content'] = pattern_content

    return data


@conditional_login_required(login_required, settings.WEB_AUTHENTICATION)
def index(request):

    if request.method == "POST" and 'pattern_file' in request.FILES:
        pattern_file = request.FILES['pattern_file']

        if pattern_file.size > settings.MAX_PATTERN_FILE_SIZE:
            return render(request, "uploader/index.html",
                          {
                              "navigation": "uploader",
                              "maintenance": False,
                              "error": "Pattern file size exceeded. Please review your pattern.",
                              "login": request.user.is_authenticated(),
                          }
                          )
        else:
            # Moving sample from django temporary file to temporary storage to
            # let it persist between reboot (if user like to configure it in that way).
            pattern_path = store_temp_file(pattern_file.read(),
                                   pattern_file.name)
            pattern_type = ""
            if 'farmer' in request.POST:
                pattern_type = "farmer"
            elif 'rss' in request.POST:
                pattern_type = "rss"
            elif 'page_crawler' in request.POST:
                pattern_type = "page_crawler"

            data = check_syntax(pattern_path)

            file_obj = File(pattern_path)
            data["pattern"] = {}
            data["pattern"]["name"] = file_obj.get_name()
            data["pattern"]["sha1"] = file_obj.get_sha1()
            data["pattern"]["md5"] = file_obj.get_md5()
            data["pattern"]["size"] = file_obj.get_size()
            data["pattern"]["type"] = pattern_type.title()
            data["pattern"]["path"] = pattern_path

            return render(request, "uploader/_confirmation.html",
                                    {
                                        "data": data,
                                        "navigation": "uploader",
                                        "maintenance": False,
                                        "login": request.user.is_authenticated(),
                                    }
                          )
    elif request.method == "POST":
        # name = request.POST.get("Name", "HarvestPatternDev")
        # email_address = request.POST.get("email", "al_deleon@trendmicro.com")

        name = request.user.username
        email_address = request.user.email
        pattern_file = request.POST.get("pattern_file", "")
        pattern_type = request.POST.get("pattern_type", "")

        if pattern_file and pattern_type:
            # Sanity check
            pattern_file = pattern_file.replace("\\","\\\\")

            pit_obj = Database()
            task_id = pit_obj.add_task(pattern_file=pattern_file, pattern_type=pattern_type,
                                       name=name, email_addrress=email_address)

            return render(request, "uploader/_successful.html",
                          {
                              "navigation": "uploader",
                              "maintenance": False,
                              "login": request.user.is_authenticated(),
                          }
                          )

    return render(request, "uploader/index.html",
                            {
                                "navigation": "uploader",
                                "maintenance": False,
                                "login": request.user.is_authenticated(),
                            }
                  )
