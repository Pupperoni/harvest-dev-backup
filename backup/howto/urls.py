from django.conf.urls import url
from howto import views

urlpatterns = [
    url(r"^harvest$", views.harvest_commands, name='harvest'),
    url(r"^harvest/commands", views.harvest_commands, name='harvest_commands'),
    url(r"^harvest/structure", views.harvest_directory_structure, name='harvest_directory_structure'),

    url(r"^pattern$", views.pattern_architecture, name='pattern'),
    url(r"^pattern/architecture", views.pattern_architecture, name='pattern_architecture'),
    url(r"^pattern/api", views.pattern_api, name='pattern_api'),
    url(r"^pattern/sample", views.pattern_sample, name='pattern_sample'),

    url(r"^autodeploy$", views.autodeploy_salt, name='autodeploy'),
    url(r"^autodeploy/salt", views.autodeploy_salt, name='autodeploy_salt'),
]
