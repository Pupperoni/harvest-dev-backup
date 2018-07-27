import sys

from django.conf import settings
from django.shortcuts import render
from django.views.decorators.http import require_safe

sys.path.append(settings.PROJECT_PATH)

# Create your views here.
@require_safe
def index(request):
    return render(request, "contact/index.html",
                            {
                                "navigation": "contact",
                                "maintenance": True,
                                "login": request.user.is_authenticated()
                            }
                  )
