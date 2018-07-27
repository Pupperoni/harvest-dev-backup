from django.conf.urls import url
from granarytools import views

urlpatterns = [
    url(r'^pending$', views.pendingDownloads, name='pending'),
    url(r'^reset$', views.resetpages, name="reset"),
    url(r'^verify$', views.verifySite, name="verify"),
    url(r'^domains$', views.domainList, name="domainList"),
]