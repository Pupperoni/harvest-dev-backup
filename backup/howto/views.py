import sys

from django.conf import settings
from django.shortcuts import render
from django.views.decorators.http import require_safe

# Create your views here.
sys.path.append(settings.PROJECT_PATH)


@require_safe
def index(request):
    return render(request, "howto/pattern/architecture/index.html",
                            {
                                "navigation": "howto",
                                "login": request.user.is_authenticated(),
                            })

@require_safe
def harvest_directory_structure(request):
    return render(request, "howto/harvest/structure/index.html",
                            {
                                "navigation": "howto",
                                "login": request.user.is_authenticated(),
                            })

@require_safe
def harvest_commands(request):
    return render(request, "howto/harvest/commands/index.html",
                            {
                              "navigation": "howto",
                                "login": request.user.is_authenticated(),
                            })

@require_safe
def pattern_architecture(request):
    return render(request, "howto/pattern/architecture/index.html",
                            {
                              "navigation": "howto",
                                "login": request.user.is_authenticated(),
                            })

@require_safe
def pattern_api(request):
    return render(request, "howto/pattern/api/index.html",
                              {
                                  "navigation": "howto",
                                  "login": request.user.is_authenticated(),
                              })

@require_safe
def pattern_sample(request):
    return render(request, "howto/pattern/sample/index.html",
                              {
                                  "navigation": "howto",
                                  "login": request.user.is_authenticated(),
                              })

@require_safe
def autodeploy_salt(request):
    return render(request, "maintenance.html",
                              {
                                  "navigation": "howto",
                                  "maintenance": True,
                                  "login": request.user.is_authenticated(),
                              })