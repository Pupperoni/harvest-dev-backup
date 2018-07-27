"""web URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin

from home import views as home_views
from home import urls as home
from howto import urls as howto
from uploader import urls as uploader
from contact import urls as contact
from search import urls as search
from contribution import urls as contribution
from granarytools import urls as granarytools

urlpatterns = [
    url(r'^admin/', admin.site.urls),

    url(r"^$", home_views.index, name='home'),
    url(r"^home/", include(home)),
    url(r"^howto/", include(howto)),
    url(r"^uploader/", include(uploader)),
    url(r"^contact/", include(contact)),
    url(r"^search/", include(search)),
    url(r"^contribution/", include(contribution)),
    url(r"^granarytools/", include(granarytools)),
]

urlpatterns += [
    url(r'^accounts/', include('django.contrib.auth.urls')),
]
