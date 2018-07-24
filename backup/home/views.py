import sys

from django.conf import settings
from django.shortcuts import render

sys.path.append(settings.PROJECT_PATH)

# Create your views here.
def index(request):

    report = dict(
    )

    return render(request, "home/index.html",
                      {
                          "report" : report,
                          "navigation": "home",
                          "login": request.user.is_authenticated()
                      }
                  )