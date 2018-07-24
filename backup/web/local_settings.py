# [20180421] - ALD local settings

import sys
import os

LOCAL_SETTINGS = True
from settings import *

# Enable Django authentication for website
WEB_AUTHENTICATION = True

# Limit the file size of pattern
MAX_PATTERN_FILE_SIZE = 10000

LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'