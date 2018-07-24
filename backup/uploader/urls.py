from django.conf.urls import url
from uploader import views

urlpatterns = [
    url(r"^", views.index, name='uploader'),
]
