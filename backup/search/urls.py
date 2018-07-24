# Copyright (C) 2016-2017 Trend Micro Inc.
# See the file 'docs/LICENSE' for copying permission.
# Grid - ALD (al_deleon@trendmicro.com)

from django.conf.urls import url
from search import views

urlpatterns = [
    url(r"^", views.index, name='search'),
]
