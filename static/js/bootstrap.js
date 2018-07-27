/* ===================================================
 * bootstrap-transition.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);/* ============================================================
 * tm-bootstrap-navbar.js v1.0.1
 * http://commercial-ui.tw.trendnet.org
 * ============================================================ */

 
!function ($) {

  "use strict"; // jshint ;_;
  
 /* LOCAL ATTRIBUTE
  * ====================== */
  var $body = $('body')
    , $window = $(window)
    , _fixableSize      = 980
    , _mobileModeSize   = 768
    , _isResponsive     = false
    , _status           = 0
    
 /* LOCAL ENUMERATE
  * ====================== */
    , STATUS_STATIC     = 1
    , STATUS_FIXED      = 2
    
 /* LOCAL FUNCTION
  * ====================== */
    , _fixedNavBar      = function () {
        var options = this.options;        
        if (_status === STATUS_FIXED) return false;
        _status = STATUS_FIXED;        
        
        this.$navbar
          .trigger($.Event('fixed'))
          .addClass(options._navbarFixedTopStaticSelector)
          .removeClass(options._navbarStaticTopSelector);
          
        $body.css('padding-top', this.height);
      }
    , _staticNaBar      = function () {
        var options = this.options;        
        if (_status === STATUS_STATIC) return false;
        _status = STATUS_STATIC;

        this.$navbar
          .trigger($.Event('static'))
          .addClass(options._navbarStaticTopSelector)
          .removeClass(options._navbarFixedTopStaticSelector);
          
        $body.css('padding-top', 0);        
      }
    , _noResponsiveCheck = function () {
        if ($window.width() < _fixableSize) {
            _checkByNormalSize.apply(this, [false]);
        } else {
            _checkByNormalSize.apply(this, [true]);
        }
      }
    , _checkByNormalSize = function (fixable) {        
        if ($window.scrollTop() >= this.bannerHeight) {
          fixable === true? _fixedNavBar.apply(this) : _staticNaBar.apply(this);
        } else {
          _staticNaBar.apply(this);
        }
      }    
  
  _isResponsive = (function () {
    var isResponsive = false;
    $body.addClass('visible-print');    
    isResponsive = $body.css('display') == 'none';
    $body.removeClass('visible-print');
    return isResponsive;
  })();

 /* CHECK BROWSER
  * ====================== */
  navigator.sayswho= (function(){
    var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
    return M;
  })();
  
  // Navbar behavior
  switch (navigator.sayswho[0].toUpperCase()) {
  case 'MSIE': case 'FIREFOX': case 'OPERA':    
    _mobileModeSize = 751;
    break;
  }
 
 /* NAVBAR SINGLETON CLASS DEFINITION
  * ================================= */
  var NavBar = function (element, options) {
    NavBar.prototype.$navbar = this.$navbar = $(element);    
    this.options = $.extend({}, $.fn.navbar.defaults, this.$navbar.data(), options);    
    this.$inner = $('.' + this.options._navbarInnerSelector, this.$navbar);
    this.height = this.$navbar.height();
    this.bannerHeight = this.height - (this.innerHeight = this.$inner.height() + 2);
    this.check();
  }

  NavBar.prototype = {
    constructor: NavBar    
  , check: function () {
      if (window.matchMedia || (navigator.sayswho[0].toUpperCase() == 'MSIE' && parseInt(navigator.sayswho[1], 10) >= 9)) {
        if (_isResponsive === true) {
          if ($window.width() >= _mobileModeSize) {
            this.$navbar.trigger($.Event('change'), ['desktop'])
            _checkByNormalSize.apply(this, [true]);            
          } else {
            this.$navbar.trigger($.Event('change'), ['mobile'])
            _staticNaBar.apply(this);
          }
        } else {
          _noResponsiveCheck.apply(this);
        }
      } else {
		_noResponsiveCheck.apply(this);        
      }
    }
  }

 /* PROGRESS PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.navbar

  $.fn.navbar = function ( option, args) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('navbar')
        , options = typeof option == 'object' && option;
      
      if (!data) $this.data('navbar', (data = new NavBar(this, options)));
      if (typeof option == 'string') data[option](args);      
    })
  }

  $.fn.navbar.Constructor = NavBar;

  $.fn.navbar.defaults = {
    //Public attributes
    collapsable:                     true
    //Private attributes
  , _navbarSelector:                 'tm-navbar'
  , _navbarStaticTopSelector :       'tm-navbar-static-top'
  , _navbarInnerSelector:            'tm-navbar-inner' 
  , _navbarFixedTopStaticSelector:   'tm-navbar-fixed-top static'  
  }


 /* NAVBAR NO CONFLICT
  * =================== */

  $.fn.navbar.noConflict = function () {
    $.fn.navbar = old
    return this;
  }
  
  $(window).on('scroll.navbar.data-api resize.navbar.data-api', function (e) {
    var $target = NavBar.prototype.$navbar || $('[data-toggle="navbar"]'),
        option = $target.data('navbar')? "check" : $.extend({}, $target.data());
        
    if ($target.length > 0) $target.navbar(option);
    e.preventDefault();
  });
  
  if (navigator.sayswho[0].toUpperCase() === 'FIREFOX') $(window).trigger('scroll');
}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);/* ============================================================
 * tm-bootstrap-alert.js v1.0.1
 * http://commercial-ui.tw.trendnet.org
 * ============================================================ */

!function ($) {
	
	"use strict"; // jshint ;_;
	
	// save the original function object
	var _super = $.fn.alert,
	dismiss = '[data-dismiss="alert"]',
	
	// generate HTML structure of the close button
	createCloseBtn = function () {
		return $('<button type="button" class="close" data-dismiss="alert">&times;</button>');
	},
	
  //get data from DOM elements 
  domClass2Options = function (dom) {
    return {
      "type": getType(dom),
      "animation": dom.hasClass('tm-alert')? dom.hasClass('fade') : true,
      "closable": dom.hasClass('tm-alert')? dom.children(dismiss).length > 0? true : false : true,
      "show": dom.hasClass('tm-alert')? dom.is(':visible') : true
    };
  },
  
  //get message type
  getType = function (element) {
    var _dom = $(element), classNames = (_dom.attr('class') || "").match(/\S+/gi), className = "tm-alert-warning";
    while(classNames && classNames.length > 0){      
      (className = classNames.pop()) && (className === 'tm-alert-error' || className === 'tm-alert-danger' || className === 'tm-alert-success' || className === 'tm-alert-info')? classNames = null : className = "tm-alert-warning";   
    }
    return className.replace('tm-alert-', "");
  },  
  
	//getParent
	getParent = function () {
		var $this = $(this),
		selector = $this.attr('data-target'),
		$parent;
		
		if (!selector) {
			selector = $this.attr('href');
			selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
		}
		$parent = $(selector);
		$parent.length || ($parent = $this.hasClass('tm-alert') ? $this : $this.parent());
		
		return $parent;
	},
	
	// create a new constructor
	Alert = function (element, options) {
  
		// do custom constructor stuff here    
		var _dom = $(element);
		!_dom.hasClass('tm-alert') && _dom.addClass('tm-alert').hide();
    
    //set show/close animation
    options.animation? _dom.addClass('fade') : _dom.removeClass('fade');
    
    //remove alert exist type    
    _dom.removeClass('tm-alert-error tm-alert-danger tm-alert-success tm-alert-info');    
    
    //set alert type
    options.type && _dom.addClass('tm-alert-' + options.type);
    
		//set closable    
    options.closable === true? _dom.find(dismiss).show().length === 0 && _dom.prepend(createCloseBtn()) : _dom.find(dismiss).hide();
    
    //set content
		options.content && _dom.append(options.content);
		
		options.show === true ? this.show.apply(element, ['init']) : this.close.apply(element, ['init']);
		
		// call the original constructor
		//_super.Constructor.apply( this, arguments );		
	},
	
	// add custom defaults
	extendOptions = $.extend({}, _super.defaults, {
    "type" : "warning",
    "content" : '',
    "animation": true,    
    "closable" : true,
    "show" : true
  }),	
	extendPrototype = {
		constructor : Alert,
		_super : function () {
			var args = $.makeArray(arguments);
			_super.Constructor.prototype[args.shift()].apply(this, args.pop());
		},
		close : function (e) {
    
			// do custom method stuff
			var $parent;
			
			e && typeof e === 'object' && e.preventDefault();
      
			$parent = getParent.apply(this);			
      if ($parent.is(':visible') === false) return;
      
			if (e !== 'init') {
				$parent.trigger(e = $.Event('close'));
				if (e.isDefaultPrevented())
					return;
			}
			
			$parent.removeClass('in');			
			function hideElement() {      
				$parent.hide();
				if (e !== 'init') {
					$parent.trigger('closed')
				}				
				$.support.transition && $parent.hasClass('fade') && $parent.off($.support.transition.end, hideElement);        
			}
			if ($.support.transition && $parent.hasClass('fade')) {
				$parent.off($.support.transition.end);
				$parent.on($.support.transition.end, hideElement);
			} else {
				hideElement();
			}
			
			// call the original method
			//Alert.prototype._super.apply(this, ['close', arguments]);
		},
		show : function () {
			// do custom method stuff
			var $parent, e, args = $.makeArray(arguments);
			
			function showElement() {
				args[0] != 'init' && $parent.trigger('shown');
				$.support.transition && $parent.hasClass('fade') && $parent.off($.support.transition.end, showElement);
			}
			
			$parent = getParent.apply(this);
      
			if ($parent.is(':visible') === true) return;
      
			args[0] != 'init' && $parent.trigger(e = $.Event('show'));
			
			$parent.show(10,
				function () {
          $parent.addClass('in');
          if ($.support.transition && $parent.hasClass('fade')) {
            $parent.off($.support.transition.end);
            $parent.on($.support.transition.end, showElement);
          } else {
            showElement();
          }
			});
		}
	};
	
	// extend prototypes and add a super function
	Alert.prototype = $.extend({}, _super.Constructor.prototype, extendPrototype);
	
	/* ALERT PLUGIN DEFINITION
	 * ======================= */	
	var old = $.fn.alert;
	
	// override the old initialization with the new constructor	
	$.fn.alert = $.extend(function (option) {
			
			var args = $.makeArray(arguments);
			
			option = args.shift();
			
			return this.each(function () {
				var $this = $(this),
            classOptions = domClass2Options($this);
       
				var data = $this.data('alert'),
            options = $.extend({}, extendOptions, classOptions, $this.data(), typeof option == 'object' && option);
       
				if (!data) {
					$this.data('alert', (data = new Alert(this, options)));
				}         
        
				if (typeof option == 'string') {
					data[option].apply(this, args);
				}
        
			});
			
		}, _super);
	
	/* ALERT NO CONFLICT
	 * ================= */	
	$.fn.alert.noConflict = function () {
        _super.noConflict();
		return this
	}
  
	/* ALERT DATA-API
	 * ============== */	
	$(document).off('click.alert.data-api', dismiss);
  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close);
  /*
	$(document).on('click.alert.data-api', dismiss, function (e) {    
    getParent.apply(this).alert();
    Alert.prototype.close.apply(this, e);
  });*/
}
(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);/* ============================================================
 * tm-bootstrap-button.js v1.0.1
 * http://commercial-ui.tw.trendnet.org
 * ============================================================ */
 
 
!function ($) {

  "use strict"; // jshint ;_;
  
  var _super = $.fn.button,
  Button = function (element, options) {
    _super.Constructor.apply( this, arguments );
  }
  
  // extend prototypes and add a super function
	Button.prototype = $.extend({}, _super.Constructor.prototype, {
    constructor : Button,
		_super : function () {
			var args = $.makeArray(arguments);
			_super.Constructor.prototype[args.shift()].apply(this, args.pop());
		},
    toggle: function () {
      // call the original method      
			Button.prototype._super.apply(this, ['toggle', arguments]);      
      if (this.$element.is('.active') === false) {
        this.$element.trigger('blur');
      }
    }
  });
  
  
  /* ALERT PLUGIN DEFINITION
	 * ======================= */	
	var old = $.fn.button;
  
  
  $.fn.button = $.extend(function (option) {
  
			var args = $.makeArray(arguments);			
			option = args.shift();
			
			return this.each(function () {
				var $this = $(this)
          , data = $this.data('button')          
          , options = typeof option == 'object' && option;
        
				if (!data) $this.data('button', (data = new Button(this, options)));
        
				if (option == 'toggle') data.toggle()
        else if (option) data.setState(option)
        
			});
			
		}, _super);
  
  
  $.fn.button.Constructor = Button;
    
  $.fn.button.defaults = {
    loadingText: 'Loading...'
  }
  
  /* ALERT NO CONFLICT
	 * ================= */	
	$.fn.button.noConflict = function () {
    _super.noConflict();
    return this;		
	}
  
  
   /* REMOVE ORIGINAL BUTTON DATA-API
  * ================================= */  
  $(document).off('click.button.data-api', '[data-toggle^=button]');
  
   /* BUTTON DATA-API
  * =============== */
  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {    
    var $btn = $(e.target);
    if (!$btn.hasClass('tm-btn')) $btn = $btn.closest('.tm-btn');    
    if(!$btn.hasClass('disabled')) $btn.button('toggle');
  });
  
}(window.jQuery);

 
/*
!function ($) {
 
  "use strict"; // jshint ;_;

  $.fn.button.defaults = {
    loadingText: 'Loading...'
  }
  
   /* REMOVE ORIGINAL BUTTON DATA-API
  * ================================= 
  
  $(document).off('click.button.data-api', '[data-toggle^=button]');
  
   /* BUTTON DATA-API
  * =============== 
  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {    
    var $btn = $(e.target);
    if (!$btn.hasClass('tm-btn')) $btn = $btn.closest('.tm-btn');    
    if(!$btn.hasClass('disabled')) $btn.button('toggle');
  })

}(window.jQuery);*//* ==========================================================
 * bootstrap-carousel.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);/* ============================================================
 * tm-bootstrap-collapse.js v1.0.1
 * http://commercial-ui.tw.trendnet.org
 * ============================================================ */

!function ($) {
  
  "use strict"; // jshint ;_;
  
  // save the original function object
  var _super = $.fn.collapse;
  
  // create a new constructor
  var Collapse = function (element, options) {  
    _super.Constructor.apply( this, arguments );

    // accordion setup 
    if (!this.options.toggle) {
      var $element = $(element)
        , $panels = $element.find('.tm-accordion-body');
      for (var i = $panels.length - 1; i >=0; i--) {
        var $panel = $($panels[i])
          , $link = $panel.parent().find('.tm-accordion-toggle');
        // if panels are not opened then add a collapsed class
        // so the right caret state is shown.
        $link[$panel.hasClass('in') ? 'removeClass' : 'addClass']('collapsed');
      }
    }
  };
  
  // extend prototypes and add a super function
  Collapse.prototype = $.extend({}, _super.Constructor.prototype, {
    constructor : Collapse
   
  , _super : function () {
      var args = $.makeArray(arguments);
      _super.Constructor.prototype[args.shift()].apply(this, args);
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .tm-accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }
  });
  


  /* COLLAPSE PLUGIN DEFINITION
   * ======================= */ 
  
  var old = $.fn.collapse;

  // override the old initialization with the new constructor 
  $.fn.collapse = $.extend(function (option) {
      var args = $.makeArray(arguments);
      
      option = args.shift();
      return this.each(function () {
        var $this = $(this),
            data = $this.data('collapse'),
            options = $.extend({}, _super.defaults, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option);

        if (!data) {
          $this.data('collapse', (data = new Collapse(this, options)));
        }         
        
        if (typeof option == 'string') {
          data[option]();
        }
        
      });
      
    }, _super);
  

  $.fn.collapse.Constructor = Collapse;


  /* COLLAPSE NO CONFLICT
   * ================= */ 
  $.fn.collapse.noConflict = function () {
    _super.noConflict();
    return this;
  };
  
  /* COLLAPSE DATA-API
   * ============== */  
  $(document).off('click.collapse.data-api', '[data-toggle=collapse]');
  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}
(window.jQuery);/* ============================================================
 * bootstrap-dropdown.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive
        , dropdowns
        
      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()
      
      dropdowns = $parent.find('> .tm-dropdown-menu')
      
      if (!isActive) {        
        $parent.toggleClass('open');
        /*if (!$.browser.msie) {  
          if (dropdowns.is('.tm-navbar > .tm-navbar-inner .tm-nav-collapse > .tm-nav > li > .tm-dropdown-menu')) {        
            dropdowns.css('height', dropdowns.attr('contentHeight') + 'px');
          }
        }*/
      }
      
      $this.focus()
      
      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $(toggle).each(function () {
      var parent = getParent($(this)).removeClass('open'),
          dropdowns = parent.find('> .tm-dropdown-menu');
      /* 
      if (!$.browser.msie) { 
        if (dropdowns.is('.tm-navbar > .tm-navbar-inner .tm-nav-collapse > .tm-nav > li > .tm-dropdown-menu')) {        
          dropdowns.css('height', 0);
        }
      }*/
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown-menu', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)
  /*
  if (!$.browser.msie) {
    $('.tm-dropdown-menu').each(
      function () { 
        var _this = $(this);       
        if (_this.is('.tm-navbar > .tm-navbar-inner .tm-nav-collapse > .tm-nav > li > .tm-dropdown-menu')) {
          _this.attr('contentHeight', _this.height()).css('height', 0);
        }    
      }
    );
  }*/
}(window.jQuery);
/* ============================================================
 * tm-bootstrap-dropdown.js v1.0.1
 * http://commercial-ui.tw.trendnet.org
 * ============================================================ */
!function ($) {

  var tmDropdown = function (element) {
    /*var $el = $(element).on('click.dropdown.data-api', this.toggle)
    $('html').on('click.dropdown.data-api', function () {
      $el.parent().removeClass('open')
    })*/
  };
  
  tmDropdown.prototype = {
    constructor: tmDropdown
  }
  
  function createDom () {
  }
  
  var old = $.fn.tmDropdown;
  
  $.fn.tmDropdown = function (option) {
    return this.each(function () {
      
    });
    /*return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new tmDropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })*/
  }
  
  $.fn.tmDropdown.Constructor = tmDropdown;

  
 /* DROPDOWN NO CONFLICT
  * ==================== */
  
  $.fn.tmDropdown.noConflict = function () {
    $.fn.tmDropdown = old;
    return this;
  }
}(window.jQuery);/* =========================================================
 * bootstrap-modal.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.tm-modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);
/* ============================================================
 * tm-bootstrap-modal.js v1.0.1
 * http://commercial-ui.tw.trendnet.org
 * ============================================================ */

!function($) {
    
  "use strict";	// jshint ;_;

  // Save the original function object
  var _super = $.fn.modal;

  // Create a new constructor
  var Modal = function(element, options) {
    // do custom constructor stuff here  
    // call the original constructor
    _super.Constructor.apply(this, arguments);
  };

  // render Loading Modal
  var renderLoadingModal = function() {
    var options = this.options, template = options._template, wording = options._wording;
    var content = options.content || wording.loadingContent;
    var htmlBody = $(template.body).addClass(template.selectorBody).append(typeof content === 'string'? $('<p></p>').html(content) : $('<p></p>').append(content));
    this.destroy(this.$element)
      .addClass(template.selectorLoadingModal + " hide")
      .append(htmlBody);
  };

  var renderNotificationModal = function(type) {
    var options = this.options, template = options._template, wording = options._wording;
    
    var htmlHeader = $(template.header).addClass(template.selectorHeader).append(template.closeBtn).append($(template.headerTitle).text(wording.notification));
    var title = $('<h5></h5>').text(options.title || wording[type]);
    var content = options.content;
    var htmlBody = $(template.body).addClass(template.selectorBody);
    if (options.remote) {
      htmlBody.load(this.options.remote, function () {
        htmlBody.prepend(title);
      });
    } else {
      if (content) htmlBody.append(title).append($('<p></p>').append(content));
    }
    var htmlFooter = $(template.footer).addClass(template.selectorFooter);
    
    var buttons = options.buttons;
    if (buttons.length > 0) {
      htmlFooter.html(renderButtons.apply(this, [buttons]));
    } else {
      htmlFooter.html(renderButtons.apply(this, [[{text: wording.OkBtn, dismiss: true}]]));
    }
    this.destroy(this.$element)
      .addClass(template.selectorNotificationModal + " hide")
      .addClass(template.selectorNotificationType + type)
      .append(htmlHeader)
      .append(htmlBody)
      .append(htmlFooter);
  };

  var renderDefaultModal = function() {
    var options = this.options, template = options._template, wording = options._wording;
    
    var htmlHeader = $(template.header).addClass(template.selectorHeader).append(template.closeBtn).append($(template.headerTitle).text(options.header));
    var htmlBody = $(template.body).addClass(template.selectorBody);
    
    //append static content or append remote content
    options.remote? htmlBody.load(this.options.remote) : htmlBody.append(options.content);
    
    var htmlFooter = $(template.footer).addClass(template.selectorFooter);
    var buttons = options.buttons;  
    if (buttons.length > 0) {
      htmlFooter.html(renderButtons.apply(this, [buttons]));
    } else {
      htmlFooter.html(renderButtons.apply(this, [[{text: wording.closeBtn, dismiss: true}]]));
    }    
    this.destroy(this.$element)
      .addClass(template.selectorModal + " hide")
      .append(htmlHeader)
      .append(htmlBody)
      .append(htmlFooter)
  };

  var renderButtons = function(buttons) {
      var html = "";
      
      for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i], id = button.id, classes = button.classes, text = button.text, dismiss = button.dismiss;
        var tmpl = '<button {{idAttr}} class="' + this.options._template.selectorButton + ' {{class}}" {{dismissAttr}} aria-hidden="true">{{text}}</button>';
        tmpl = id? tmpl.replace("{{idAttr}}", "id='" + id + "'") : tmpl.replace("{{idAttr}}", "");
        tmpl = classes? tmpl.replace(" {{class}}", classes) : tmpl.replace(" {{class}}", "");
        tmpl = text? tmpl.replace("{{text}}", text) : tmpl.replace("{{text}}", "");
        tmpl = !dismiss? tmpl.replace("{{dismissAttr}}", "") : tmpl.replace("{{dismissAttr}}", "data-dismiss='modal'");
        
        html += tmpl;
      }
      return html;
    }
  // Extend prototypes and add a super function
  Modal.prototype = $.extend({}, _super.Constructor.prototype, {
    constructor: Modal,
    _super: function() {
      var args = $.makeArray(arguments);
      _super.Constructor.prototype[args.shift()].apply(this, args);
    },
    show: function() {
      var that = this;
      // do custom method stuff      
      if (this.options.type && this.options.toggle !== "modal") {
        var type = (this.options.type).toLowerCase();
        
        if (type === "loading") {
          renderLoadingModal.apply(this);
        } else if ( type === "info" || type === "success" || type === "warning" || type === "error") {
          renderNotificationModal.apply(this, [type]);
        } else {
          if (this.options.content !== '') {
            renderDefaultModal.apply(this);
          }
        }
      }
      
      // call the original method
      this._super("show");
    },
    destroy: function (ele) {
      //remove related classes
      var template = this.options._template;
      ele
        .removeClass(template.selectorModal)
        .removeClass(template.selectorLoadingModal)
        .removeClass(template.selectorNotificationModal)
        .removeClass(template.selectorNotificationType + 'info')
        .removeClass(template.selectorNotificationType + 'success')
        .removeClass(template.selectorNotificationType + 'warning')
        .removeClass(template.selectorNotificationType + 'error')
        .removeClass('hide in')
        .empty();
      return ele;
    }
  });

  // Override the old initialization with the new constructor
  $.fn.modal = $.extend(function(option) {

    var args = $.makeArray(arguments);
    option = args.shift();
    
    return this.each(function() {
      
      var $this = $(this);
      var data = $this.data("modal");
      
      var options = $.extend({}, _super.defaults, $.fn.modal.defaults, $this.data(), typeof option == "object" && option);
      
      if (!data) {
        $this.data("modal", (data = new Modal(this, options)));
      }
      if (typeof option == "string") {
        data[option].apply(data, args);
      } else if (options.show) {
        data.show.apply(data, args);
      }
    });

  }, _super);


  // Add new custom default methods
  $.fn.modal.defaults = $.extend({}, _super.defaults, {
    //public options
    type:                         "default"
  , remote:                       false
  , header:                       ""
  , title:                        ""
  , content:                      ""
  , buttons:                      []
    //private options
  , _template: {
      selectorModal:              'tm-modal'
    , selectorLoadingModal:       'tm-modal tm-modal-loading'
    , selectorNotificationModal:  'tm-modal tm-notification'
    , selectorNotificationType:   'tm-notification-'
    , selectorHeader:             'tm-modal-header'
    , selectorCloseBtn:           'close'    
    , selectorBody:               'tm-modal-body'
    , selectorFooter:             'tm-modal-footer'
    , selectorButton:             'tm-btn'
    , header:                     '<div></div>'
    , headerTitle:                '<h6></h6>'
    , closeBtn:                   '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'
    , body:                       '<div></div>'
    , footer:                     '<div></div>'
    }
  , _wording: {
      loadingContent:             'Loading...'
    , notification:               'Notification'
    , info:                       'Information'
    , success:                    'Success'
    , warning:                    'Warning'
    , error:                      'Error'
    , OkBtn:                      'OK'
    , closeBtn:                   'Close'
  }
  });
    
  /* Modal NO CONFLICT
   * ================= */	
  $.fn.modal.noConflict = function () {
    _super.noConflict();
    return this;
  }

  /* MODAL DATA-API
  * ============== */
  $(document).off('click.modal.data-api', '[data-toggle="modal"]');
  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); //strip for ie7
      
      var option = $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())
      , $instance = $target.data('modal');
      
    if ($instance) {
      if (option.remote) {
        if ($instance.options.remote === false) {
          $instance.options.remote = option.remote;
        }
      }
      option = 'toggle';
    }

    e.preventDefault();
    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  });
}(window.jQuery);/* ===========================================================
 * bootstrap-tooltip.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);
/* ============================================================
 * tm-bootstrap-popover.js v1.0.1
 * http://commercial-ui.tw.trendnet.org
 * ============================================================ */
!function ($) {
 
  "use strict"; // jshint ;_;
  var _super = $.fn.popover
    , Popover = function (element, options) {
      // call the original constructor
      _super.Constructor.apply(this, arguments);
    };
  
  // extend prototypes and add a super function
	Popover.prototype = $.extend({}, _super.Constructor.prototype, {
    constructor: Popover
  , _super : function () {
			var args = $.makeArray(arguments);
			_super.Constructor.prototype[args.shift()].apply(this, args.pop());
		}
  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.tm-popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.tm-popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }
  });
  
  /* POPOVER PLUGIN DEFINITION
	 * ======================= */	
	var old = $.fn.popover;
  
  // override the old initialization with the new constructor	
  $.fn.popover = $.extend(function (option) {
  
    var args = $.makeArray(arguments);
    
    option = args.shift();
    
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = $.extend({}, _super.defaults, $.fn.popover.defaults, $this.data(), typeof option == 'object' && option);
     
      if (!data) {
        $this.data('popover', (data = new Popover(this, options)));
      }         
      
      if (typeof option == 'string') {
        data[option].apply(data);
      }
      
    });
    
  }, _super);
  
  $.fn.popover.defaults = {
    'template': '<div class="tm-popover"><div class="arrow"></div><h6 class="tm-popover-title"></h6><div class="tm-popover-content"></div></div>'
  };
  
  $.fn.popover.Constructor = Popover;
  
  /* POPOVER NO CONFLICT
   * ================= */ 
  $.fn.popover.noConflict = function () {
    _super.noConflict();
    return this
  }; 

}(window.jQuery);/* =============================================================
 * bootstrap-scrollspy.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);/* ============================================================
 * tm-bootstrap-tab.js v1.0.1
 * http://commercial-ui.tw.trendnet.org
 * ============================================================ */

!function ($) {
  
  "use strict"; // jshint ;_;
  
  // save the original function object
  var _super = $.fn.tab
  
  // create a new constructor
  var Tab = function (element, options) {
    _super.Constructor.apply(this, arguments);
  }
  
  // extend prototypes and add a super function
  Tab.prototype = $.extend({}, _super.Constructor.prototype, {
    constructor: Tab

  , _super: function() {
      var args = $.makeArray(arguments);
      _super.Constructor.prototype[args.shift()].apply(this, args);
    }

  , show: function () {
      if(!this.element.parent().hasClass('disabled')){
        var $this = this.element
          , $ul = $this.closest('ul:not([class*="dropdown-menu"])')
          , selector = $this.attr('data-target')
          , previous
          , $target
          , e

        if (!selector) {
          selector = $this.attr('href')
          selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
        }

        if ( $this.parent('li').hasClass('active') ) return

        previous = $ul.find('.active:last a')[0]

        e = $.Event('show', {
          relatedTarget: previous
        })

        $this.trigger(e)

        if (e.isDefaultPrevented()) return

        $target = $(selector)

        this.activate($this.parent('li'), $ul)
        this.activate($target, $target.parent(), function () {
          $this.trigger({
            type: 'shown'
          , relatedTarget: previous
          })
        })
      }
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> [class*="dropdown-menu"] > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('[class*="dropdown-menu"]') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }

  });
  
  /* TAB PLUGIN DEFINITION
   * ======================= */  
  var old = $.fn.tab;

  // override the old initialization with the new constructor 
  $.fn.tab = $.extend(function (option) {
      
      var args = $.makeArray(arguments);
      
      option = args.shift();
      
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('tab')
          , options = $.extend({}, _super.defaults, $.fn.tab.defaults, $this.data(), typeof option == 'object' && option);
       
        if (!data) {
          $this.data('tab', (data = new Tab(this, options)));
        }         
        
        if (typeof option == 'string') {
          data[option].apply(data);
        }
        
      });
      
    }, _super);
  
  $.fn.tab.defaults = {};

  $.fn.tab.Constructor = Tab;

  /* TAB NO CONFLICT
   * ================= */ 
  $.fn.tab.noConflict = function () {
    _super.noConflict();
    return this
  };
  
  /* TAB DATA-API
   * ============== */  
  $(document).off('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]')
  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

}
(window.jQuery);/* ============================================================
 * tm-bootstrap-sidenav.js v1.0.1
 * http://commercial-ui.tw.trendnet.org
 * ============================================================ */
!function ($) {

  "use strict"; // jshint ;_;


 /* Sidenav CLASS DEFINITION
  * ====================== */

  var root = '.tm-nav-nested-list'
    , toggle = '[data-toggle="tm-nav-nested-list"]'
    , ActiveList = '.tm-nav-list > li > a'
    , Sidenav = function (el) {
      var root = $(el);
      root.data('cates', root.find(toggle));    
      root.data('lists', root.find(ActiveList).parent());      
    }
  
  Sidenav.prototype = {
    'constructor' : Sidenav
  , 'toggle': function (e) {
      var subList = e.next();
      e.is('.collapsed')? e.removeClass('collapsed') : e.addClass('collapsed');
      subList.hasClass('in')? subList.collapse('hide') : subList.collapse('show');
    }
  , 'active': function (e) {      
      if (e.is(toggle)) {
        this.data("sidenav").toggle.call(this, e);
      } else {
        this.data('lists').removeClass('active');
        //e.parent().addClass('active');
      }      
    }
  }


 /* SIDENAV PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.sidenav

  $.fn.sidenav = function (option, arg) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('sidenav');
      
      if (!data) $this.data('sidenav', (data = new Sidenav(this)))
      if (typeof option == 'string') data[option].call($this, arg)
    })
  }

  $.fn.sidenav.Constructor = Sidenav;


 /* Sidenav NO CONFLICT
  * ================= */

  $.fn.sidenav.noConflict = function () {
    $.fn.sidenav = old;
    return this;
  }


 /* Sidenav DATA-API
  * ============== */
  $(document).on('click.sidenav.data-api', ActiveList, function (e) {
    var $list = $(e.target).is('.caret')? $(e.target).parent() : $(e.target), 
        $root, 
        $parent = $list.parent().parent();

    if ($parent.prev().is(toggle)) {
      $root = $parent.parent().parent();
      if (!$root.is(root)) {        
        e.preventDefault();
        return;
      }
    } else {
      $root = $parent;
    }    
    if (!$root.data('sidenav')) {
      $root.sidenav($root.data());
    }
    $root.sidenav('active', $list);
  })
}(window.jQuery);
/* =============================================================
 * bootstrap-typeahead.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  })

}(window.jQuery);
/* ============================================================
 * tm-bootstrap-typeahead.js v1.0.1
 * http://commercial-ui.tw.trendnet.org
 * ============================================================ */

!function ($) {
	
	"use strict"; // jshint ;_;	
		
	$.fn.typeahead.defaults.menu = '<ul class="typeahead tm-dropdown-menu"></ul>';
   
}
(window.jQuery);/* ==========================================================
 * bootstrap-affix.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);/* ============================================================
 * tm-bootstrap-progress.js v1.0.1
 * http://commercial-ui.tw.trendnet.org
 * ============================================================ */
!function ($) {

  "use strict"; // jshint ;_;


 /* PROGRESS PUBLIC CLASS DEFINITION
  * =============================== */

  var Progress = function (element, options) {    
    this.init('progress', element, options);    
  }

  Progress.prototype = {

    constructor: Progress

  , init: function (type, element, options) {
    
      this.type = type;
      this.$element = $(element);
      this.options = this.getOptions(options);
      
      var groupSelector      =    this.options._progressGroupSelector
        , progressSelector   =    this.options._progressSelector
        , barSelector        =    this.options._barSelector
        , labelSelector      =    this.options._labelSelector
        , parent
        , progressGroup      =    this.$progressGroup     =   this.getElementBySelector(this.$element, '.' + groupSelector)
        , progress           =    this.$progress          =   this.getElementBySelector(this.$element, '.' + progressSelector)
        , bar                =    this.$bar               =   this.getElementBySelector(this.$element, '.' + barSelector)
        , label              =    this.$label             =   this.getElementBySelector(this.$element, labelSelector);
        
        
      if ( this.options.percentable === true ) {
        progressGroup.length === 0 && (progressGroup = this.$progressGroup = this.$element.hasClass(progressSelector) === true? $(this.options._progressGroup).insertBefore(this.$element) : this.$element.addClass(groupSelector));
        label.length         === 0 && (label         = this.$label         = $(this.options._label));
      } else {
        label.hide();
      }
      
      progress.length === 0 && (progress = this.$progress = this.$element.hasClass(groupSelector)? $(this.options._progress) : this.$element.addClass(progressSelector));
      bar.length      === 0 && (bar      = this.$bar      = $(this.options._bar));
      
      progressGroup.append(progress.append(bar.width('0%')), label.text('0 %'));
      
      //speed
      this.options.speed && this.speed(this.options.speed);
      //striped
      this.striped(this.options.striped);      
      //active
      this.active(this.options.active)
      //percentage
      this.percentage(this.options.percentage);    
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);
      return options;
    }
    
  , getElementBySelector: function (element, selector) {
      return element.is(selector) === true? element : element.find(selector);
    }
  
  , triggerComplete: function() {      
      this.$label.text('100%');
      this.active(false);
      this.$element.trigger($.Event('complete'));      
    }
  
  , percentage: function (percent) {
      if (!isNaN(parseFloat(percent))) {
        percent = parseFloat(percent);
        
        if (percent >= 100 && this.completed === true) return;
        
        if (percent >= 100 && this.completed === false) {
          percent = 100;                    
          this.completed = true;
          this.$bar.width('100%');
          
          //trigger customized event          
          $.support.transition? this.$bar.on($.support.transition.end, $.proxy(function() {      
              this.triggerComplete();
              this.$bar.off($.support.transition.end);
          }, this)) : this.triggerComplete();
          
        } else if (percent < 100) {
          this.options.striped === true && this.active(this.options.active);         
          this.completed = false;
          this.$bar.width(percent + '%');
          this.$label.text(percent + '%');
        }        
      } else if (percent === 'infinity') {
        this.$label.hide();
        this.active(true);
        this.striped(true);
        this.$bar.width('100%');
      }
    }
  
  , active: function (active) {
      if (active === true)  this.$progress.addClass(this.options._progressActiveSelector);    
      if (active === false) this.$progress.removeClass(this.options._progressActiveSelector);  
    }
  
  , striped: function (striped) {
      if (striped === true)  this.$progress.addClass(this.options._progressStripeSelector);    
      if (striped === false) this.$progress.removeClass(this.options._progressStripeSelector);    
    }
    
  , speed: function (speed) {      
      !isNaN(parseFloat(speed)) && this.$bar.css('animationDuration', parseFloat(speed) + 's');
    }

  }

 /* PROGRESS PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.progress

  $.fn.progress = function ( option, args) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('progress')
        , options = typeof option == 'object' && option;
      
      if (!data) $this.data('progress', (data = new Progress(this, options)));
      if (typeof option == 'string') data[option](args);
    })
  }

  $.fn.progress.Constructor = Progress;

  $.fn.progress.defaults = {
  //Public attributes
    percentage              :   0
  , percentable: true
  , striped: true
  , active: true
  //Private attributes
  , _progressGroupSelector  :   'tm-progress-group'
  , _progressSelector       :   'tm-progress'
  , _progressStripeSelector :   'tm-progress-striped'
  , _progressActiveSelector :   'active'
  , _barSelector            :   'bar'
  , _labelSelector          :   'label'  
  , _progressGroup          :   '<div class="tm-progress-group"></div>'
  , _progress               :   '<div class="tm-progress"></div>'
  , _bar                    :   '<div class="bar"></div>'
  , _label                  :   '<label></label>'  
  }


 /* PROGRESS NO CONFLICT
  * =================== */

  $.fn.progress.noConflict = function () {
    $.fn.progress = old
    return this
  }

}(window.jQuery);/* ============================================================
 * tm-bootstrap-pagination.js v1.0.1
 * http://commercial-ui.tw.trendnet.org
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;

 /* PAGINATION CLASS DEFINITION
  * ====================== */

  var Pagination = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.pagination.defaults, this.$element.data(), normalizeOptionKey(options));
    this.recordsPerPage = this.options.recordsPerPage;
    this.totalPages = Math.ceil(this.options.records / this.recordsPerPage);
    this.currentPage = this.options.currentPage < this.totalPages ? ((this.options.currentPage > 1) ? this.options.currentPage: 1) : this.totalPages;
    this.resetPageBounds = true;
    this.view = this.options.view;
    this.$element.addClass('tm-pagination');
    this.render();
  }

  Pagination.prototype = {
    constructor: Pagination

  , render: function () {
      this.totalPages = Math.ceil(this.options.records / this.recordsPerPage);
      //clear old list
      this.$element.empty();

      // only one page no need for pagination
      if (this.totalPages <= 1 && this.view === 'standard') return;

      // set lower and upper page bounds
      this.setLowerUpperPageBounds();

      if (this.view === 'standard') {
        this.drawStandardPager();
      } else {
        this.$element.addClass('tm-table-pagination');
        this.drawTablePager();
      }
    }

  , drawTablePager: function () {
      var opts = this.options
        , optValues = opts.optValues.split(',')
        , recordset = this.lowerPageBound === this.upperPageBound ? this.lowerPageBound : this.lowerPageBound + '</span>-<span>' + this.upperPageBound
        , tmpl = '<ul>' + 
                    '<li class="records">' +
                      '<span>Records:</span><span>' + recordset + '</span>/<span>' +  opts.records + '</span>' +
                    '</li>' + 
                    '<li class="tm-divider-vertical"></li>' +
                    '<li class="first-page"><span></span></li>' +
                    '<li class="prev-page"><span></span></li>' + 
                    '<li class="input-page">Page<input type="text" value="' + this.currentPage + '">/<span>' + this.totalPages + '</span></li>' +
                    '<li class="next-page"><span></span></li>' + 
                    '<li class="last-page"><span></span></li>' + 
                    '<li class="tm-divider-vertical"></li>' + 
                    '<li class="select-page">' + 
                      '<select>';

                    for (var i = 0, len = optValues.length; i < len; i++) {
                      var optVal = optValues[i]
                        , selected = optVal === this.recordsPerPage ? 'selected' : '';

                      tmpl += '<option value="' + optVal + '"' + selected + '>' + optVal + '</option>';
                    }

        tmpl +=        '</select>per page' +
                    '</li>' +             
                  '</ul>';

      this.$element
        .append($(tmpl))
        .find('li')
        .data('pagination', this);            

    }

  , drawStandardPager: function () {
      var $list = $('<ul></ul>');

      // add previous link
      this.buildPrevNextLinks('prev', $list);

      // generate page links
      this.buildPageLinks(this.lowerPageBound, this.upperPageBound, $list);

      // add ellipsis
      if (this.upperPageBound < this.totalPages) {
        $list
          .append($('<li class="ellipsis"><span>…</span></li>'));
      }

      // add next link
      this.buildPrevNextLinks('next', $list);

      // add link to dom
      this.$element
        .html($list);
    }

  , setLowerUpperPageBounds: function () {
      var opts = this.options
        , pageBuffer = Math.ceil(opts.displayedPages / 2)
        , pageOffset = opts.displayedPages % 2 === 0 ? 0 : 1;

      if (this.view === 'standard') {
        if (this.totalPages > opts.displayedPages) {
          // set lower and upper page bounds
          if ( this.currentPage === this.upperPageBound || 
               this.currentPage === this.lowerPageBound || 
               this.resetPageBounds) {

            if (this.resetPageBounds) {
              this.resetPageBounds = false;
            }

            this.lowerPageBound = (this.currentPage - pageBuffer) + 1 ;
            this.upperPageBound = (this.currentPage + pageBuffer) - pageOffset;
          }

          // check for out of range
          if (this.lowerPageBound < 1) {
            this.lowerPageBound = 1;
            this.upperPageBound = opts.displayedPages;
          }

          if (this.upperPageBound > this.totalPages) {
            this.lowerPageBound = (this.totalPages - opts.displayedPages) + 1;
            this.upperPageBound = this.totalPages;
          }

        } else {
          this.lowerPageBound = 1;
          this.upperPageBound = this.totalPages;
        }
      } else {
        this.upperPageBound = this.currentPage * this.recordsPerPage;
        this.lowerPageBound = this.upperPageBound - (this.recordsPerPage - 1);

        if (this.currentPage === this.totalPages) {
          if (this.upperPageBound > opts.records) {
            this.upperPageBound = opts.records;
          }          
        }
      }
    }

  , buildPrevNextLinks: function (text, $list) {
      var opts = this.options
        , pageContext = {
            prev: {
                cssText: 'prev-page'
              , text: '‹'
              , pageLimit: 1
              , page: this.currentPage === 1 ? 1 : this.currentPage - 1
            },
            next: {
                cssText: 'next-page'
              , text: '›'
              , pageLimit: this.totalPages 
              , page: this.currentPage === this.totalPages ? this.totalPages : this.currentPage + 1 
            }
          }
        , context = pageContext[text]
        , cssClass = (this.currentPage === context.pageLimit) ? context.cssText + ' disabled' : context.cssText
        , $link = this.buildLink(cssClass, context.text, context.page);

      return $list.append($link);
    }

  , buildPageLinks: function (lowerPageBound, upperPageBound, $list) {
      for (var i = lowerPageBound ; i <= upperPageBound; i++) {

        var cssClass = (this.currentPage === i) ? ' active' : ''
          , $link = this.buildLink(cssClass, i, i);

        $list.append($link);
      }
      
      return $list;
    }

  , buildLink: function (cssClass, text, index) {
      //console.log('class:' + cssClass, 'text:' + text, 'index:' + index);
      return $('<li><a href="#"></a></li>')
                      .addClass(cssClass)
                      .find('a')
                      .attr('page', index)
                      .data({
                        'page': index,
                        'pagination': this
                      })                      
                      .text(text)
                      .end();
    }

  , setPage: function (index) {
      index = index < 1 ? 1 : index > this.totalPages ? this.totalPages : index;
      this.currentPage = parseInt(index, 10);
      this.render();
      this.$element.trigger($.Event('pageChange'), [index]); 
    }  

  , selectPage: function (index) {
      this.resetPageBounds = true;
      this.setPage(index);      
    }

  , nextPage: function () {
      if (this.currentPage < this.totalPages) {
        this.setPage(this.currentPage + 1);
      }
    }

  , prevPage: function () {
      if (this.currentPage > 1) {
        this.setPage(this.currentPage - 1);
      }
    }

  , firstPage: function () {
      this.resetPageBounds = true;
      this.setPage(1);
    }

  , lastPage: function () {
      this.resetPageBounds = true;
      this.setPage(this.totalPages);
    }

  , updateRecordsPerPage: function (recordsPerPage) {
      this.resetPageBounds = true;
      this.recordsPerPage = recordsPerPage;
      this.setPage(1);
    }
  }


 /* PAGINATION PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.pagination

  $.fn.pagination = function (option, args) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('pagination')
        , options = typeof option == 'object' && option
      if (!data) $this.data('pagination', (data = new Pagination(this, options)))
      if (typeof option == 'string') data[option](args)
    })
  }

  $.fn.pagination.Constructor = Pagination

  $.fn.pagination.defaults = {
    records: 100
  , recordsPerPage: 10
  , displayedPages: 5
  , currentPage: 1
  , view: 'standard'
  , optValues: '10, 30, 50'
  }


 /* PAGINATION NO CONFLICT
  * ================= */

  $.fn.pagination.noConflict = function () {
    $.fn.pagination = old
    return this
  }

  /* PAGINATION DATA-API
   * ============== */  
  $(document).on(
    'click.pagination.data-api', '.tm-pagination a', function (e) {
      var $this = $(this)
        , index = $this.data('page')
        , href = $this.attr('href').toLowerCase();     
      if (href === '#' || href.indexOf('javascript') === 0) {
        if ($this.data('pagination'))
          $this.data('pagination').setPage(index);
        
        e.preventDefault();
      }      
    } 
  );

  /* table pagination events
   * ================ */
  $(document).on(
    'click.table-pagination.data-api', '.tm-table-pagination li[class$="-page"]', function (e) {
      var $this = $(this)
        , firstChildTag = $this.children(':first')[0].tagName.toLowerCase();

      if ( firstChildTag != 'input' && firstChildTag != 'select' ) {
        var $pagination = $this.data('pagination')
          , func = $pagination[camelCase(e.target.parentNode.className)];

        if (typeof func === 'function') {
          func.call($pagination);
        }
      }
    } 
  );

  $(document).on(
    'change.table-pagination.data-api', '.tm-table-pagination input:text', function (e) {
      var $this = $(this)
        , val = $this.val();
      if (isNumber(val)) {
        setTimeout(function () {        
          // fire on next event loop to prevent firing of 
          // additional change event caused by render()
          $this.parent().data('pagination').setPage(val);
        }, 10);

      }
    } 
  );

  $(document).on(
    'change.table-pagination.data-api', '.tm-table-pagination select', function (e) {
      var $this = $(this);

      $this.parent().data('pagination').updateRecordsPerPage($this.val());
    } 
  );


  /* HELPERS
  * ========================= */

  // normalize option keys passed in by user
  function normalizeOptionKey (options) {
    var result = {};
    for (var i in options) {
      if (options.hasOwnProperty(i)) {
        result[camelCase(i)] = options[i];
      }
    }
    return result;
  }

  // converts text to camelCase
  function camelCase (text) {
    return text.replace(/-([a-z])/g, function parse (g) {return g[1].toUpperCase()});
  }

  function isNumber (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

}(window.jQuery);/* ============================================================
 * tm-bootstrap-selection.js v1.0.1
 * http://commercial-ui.tw.trendnet.org
 * ============================================================ */

;(function($) {
	
	// Constructor
	var AddRemoveList = function(element, options) {
		this.elem = element;
		this.$elem = $(this.elem);
		this.options = options;
		this.source = this.options.source;
		this.target = this.options.target;
	}
	
	// Prototype
	AddRemoveList.prototype = {
		
		defaults: {
			source: {},
			target: {},
			insertTo: 'beginning'
		},
		
		init: function() {
			var self = this;
			
			self.settings = $.extend({}, self.defaults, self.options);
			
			self.render();

			return this;
		},
		
		render: function() {
			var self = this;
			var html = '';
		
			html += '<div class="tm-selection-row">';
			html += '<div class="tm-selection-cell">';
			html += '<select class="tm-selection-selector" data-role="source" multiple="multiple">';
			
			if (this.settings.source.length > 0) {
				var sourceItems = this.settings.source;
				
				for (var i = 0; i < sourceItems.length; i++) {
					var sourceItem = sourceItems[i];
					
					html += '<option value="' + sourceItem.value + '">' + sourceItem.text + '</option>';
				}
			}
			
			html += '</select>';
			html += '</div>';
			html += '<div class="tm-selection-cell tm-selection-actions">';
			html += '<button type="button" class="tm-btn tm-btn-rightward" data-toggle="add"></button>';
			html += '<button type="button" class="tm-btn tm-btn-leftward" data-toggle="remove"></button>';
			html += '</div>';
			html += '<div class="tm-selection-cell">';
			html += '<select class="tm-selection-selector" data-role="target" multiple="multiple">';
			
			if (this.settings.target.length > 0) {
				var targetItems = this.settings.target;
				
				for (var j = 0; j < targetItems.length; j++) {
					var targetItem = targetItems[j];
					
					html += '<option value="' + targetItem.value + '">' + targetItem.text + '</option>';
				}
			}
			
			html += '</select>';
			html += '</div>';
			html += '</div>';
			
			self.$elem.addClass('tm-selection').html(html);
			
			// Register event listeners
			self.registerEvents();
		},
		
		registerEvents: function() {
			var self = this;
			
			// Register 'Click' event to 'Add' & 'Remove' buttons as an event listener
			self.$elem.find('[data-toggle="add"]').on('click', $.proxy(self.addItems, self));
			self.$elem.find('[data-toggle="remove"]').on('click', $.proxy(self.removeItems, self));
		},
		
		// Handle add items event
		addItems: function() {
			var self = this;
			
			self.$elem.find('[data-role="source"]').children('option:selected').each(function() {
				var selectedItems = '<option value="' + $(this).val() + '">' + $(this).text() + '</option>';
				
				if (self.settings.insertTo === 'end') {
					self.$elem.find('[data-role="target"]').append(selectedItems);
				} else {
					self.$elem.find('[data-role="target"]').prepend(selectedItems);
				}
				$(this).remove();
			});  
      self.$elem.trigger("added");
		},
		
		// Handle remove items event
		removeItems: function() {
			var self = this;
			
			self.$elem.find('[data-role="target"]').children('option:selected').each(function() {
				var selectedItems = '<option value="' + $(this).val() + '">' + $(this).text() + '</option>';
				
				if (self.settings.insertTo === 'end') {
					self.$elem.find('[data-role="source"]').append(selectedItems);
				} else {
					self.$elem.find('[data-role="source"]').prepend(selectedItems);
				}
				$(this).remove();
			});
      self.$elem.trigger("removed");
		}
	};
	
	AddRemoveList.defaults = AddRemoveList.prototype.defaults;

	$.fn.selection = function(options) {
		return this.each(function() {
			new AddRemoveList(this, options).init();
		});
	};
	
}(window.jQuery));/* ============================================================
 * tm-bootstrap-splitter.js
 * http://commercial-ui.tw.trendnet.org
 * ============================================================ */
!function ($) {

  "use strict"; // jshint ;_;

 /* SPLITTER PUBLIC CLASS DEFINITION
  * ================================ */
  if (!navigator.sayswho) {
    navigator.sayswho= (function(){
      var N= navigator.appName, ua= navigator.userAgent, tem
      var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i)
      if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1]
      M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?']
      return M
    })();
  }
  function disableSelection() {
    this.$splitter.addClass('active')
    if (navigator.sayswho[0].toUpperCase() == 'MSIE' && parseInt(navigator.sayswho[1], 10) < 10) {
      this.$splitter
        .attr('unselectable', 'on')
        .on('selectstart', false)
    }
  }
  function enableSelection() {
    this.$splitter.removeClass('active')
    if (navigator.sayswho[0].toUpperCase() == 'MSIE') {
      this.$splitter
        .attr('unselectable', 'off')
        .off('selectstart')
    }
  }
  function position (resize) {
    var _this = this, _options = this.options, _tmp = _options._template, _units = this.units, _reduceDim
    
    this.$panels = this.$splitter.data('dim', 0).children().not('.' + _tmp.splitbar)
    
    this.$panels.each(function (idx, item) {
      var _panel = $(item)
        , _content = _panel.children()
        , _splitbar = _this.$splitbar.clone(false)
        , _container = $('<div></div>')      
      
      if (!_this.$splitbars) {
        _panel.append(_container.append(_content))
        _splitbar.insertBefore(_panel.next())
        _panel.data('dim', _panel[_this.units.unit]())
        
        if (!_this.units.splitbarHelfDim) _this.units.splitbarHelfDim = (_splitbar['outer' + _units.unitMethod]() / 2)
      } else {
        if (idx === 0 || idx === _this.$splitbars.length) {
          _panel.data('dim', _panel[_this.units.unit]() + _this.units.splitbarHelfDim)
        } else {
          _panel.data('dim', _panel[_this.units.unit]() + (_this.units.splitbarHelfDim * 2))          
        }        
      }
      _this.$splitter.data('dim', _this.$splitter.data('dim') + _panel.data('dim'))
      _container.addClass(_tmp['panel-content'])
    }).addClass(_tmp.panel)
    
    this.$splitbars = this.$splitter.find('> .' + _tmp.splitbar).each(function (idx, item) {
      var _splitbar = $(item)
        , _prevPanel = _splitbar.prev()
        , _nextPanel = _splitbar.next()
        , _prevDim
        , _nextDim
      
      _prevDim  = (_prevPanel.data('dim') / _this.$splitter.data('dim') * _this.$splitter[_units.unit]()) - (_this.units.splitbarHelfDim * (_prevPanel.prevAll('.' + _tmp.splitbar).length === 0? 1 : 2))
      _nextDim  = (_nextPanel.data('dim') / _this.$splitter.data('dim') * _this.$splitter[_units.unit]()) - _this.units.splitbarHelfDim
      
      _prevPanel.css(_units.unit, _prevDim)
      _nextPanel.css(_units.unit, _nextDim)      
      _splitbar.css(_units.splitbarPos, _prevPanel.position()[_units.splitbarPos] + _prevDim)
      _nextPanel.css(_units.splitbarPos, _splitbar.position()[_units.splitbarPos] + _splitbar['outer' + _units.unitMethod]())
    })
    
    this.$splitbars.last().next().css(_units.unit, this.$splitter[_units.unit]() - this.$splitbars.last().next().position()[_units.splitbarPos])    
  }
  var Splitter = function (element, options) {
    var _options = this.options = $.extend({}, $.fn.splitter.defaults, options)
      , _tmp = _options._template
      , $splitter = $(element)
      , $chk
      , _$splitter
      
    this.$splitbar = $('<div data-resize="splitter"></div>')
        .addClass(_tmp.splitbar)
        .addClass(_tmp.splitbarDraggable)
        .append($('<span></span>').addClass(_tmp.splitbarHandler))
    
    if (_options.direction && _options.direction != 'horizontal' && _options.direction != 'vertical') _options.direction = 'horizontal'
    _options.direction === 'horizontal'? 
      this.units = {unit: 'width', unitMethod: 'Width', splitbarPos: 'left', mouseUnit: 'pageX', cursor: 'col-resize'} :
      this.units = {unit: 'height', unitMethod: 'Height', splitbarPos: 'top', mouseUnit: 'pageY', cursor: 'row-resize'}
    
    $chk = $splitter.children()
    $chk.is('.' + _tmp['panel-content'])? this.$splitter = $chk : this.$splitter = $splitter    
    this.$splitter
      .data('orgSplitter', $splitter)
      .addClass(_tmp.splitter)
      .addClass(_tmp.splitter + '-' + _options.direction)
      .closest('.' + _tmp['panel-content']).addClass('hasSplitter')   

    position.apply(this);
    
    this.$splitter.on('mousedown.splitter.data-api', '>[data-resize="splitter"]', $.proxy(this.start, this))
  }
  
  Splitter.prototype = {

    constructor: Splitter

  , start: function (e) {
      var _options = this.options
        , _currentSplitbar = $(e.target).closest('.' + _options._template.splitbar).addClass('active')
        , _prevPanel = _currentSplitbar.prev()
        , _nextPanel = _currentSplitbar.next()
        , _prevOffsetStart = Math.round(_prevPanel.offset()[this.units.splitbarPos])
        , _prevPosStart = Math.round(_prevPanel.position()[this.units.splitbarPos])
        , _nextPosEnd = Math.round(_nextPanel.position()[this.units.splitbarPos]) + _nextPanel[this.units.unit]()

      this.$splitbarAlias = _currentSplitbar.clone(false).empty().addClass(_options._template.splitbarZombie).removeClass('active')
      
      this.currentInfo = {
        currentSplitbar: _currentSplitbar
      , prevPanel: _prevPanel
      , nextPanel: _nextPanel
      , prevOffsetStart: _prevOffsetStart
      , prevPosStart: _prevPosStart
      , nextPosEnd: _nextPosEnd
      , nextLimit: _nextPosEnd - _prevPosStart - this.units.splitbarHelfDim
      }      
      
      $('body *').css('cursor', this.units.cursor)
      disableSelection.apply(this)
      
      $(document).on('mouseup.splitter.data-api', $.proxy(this.end, this))
      $(document).on('mousemove.splitter.data-api', $.proxy(this.drag, this))
    }
  , drag : function (e) {
      var _tmp = this.options._template
        , _info = this.currentInfo
        , _splitbarHelfDim = this.units.splitbarHelfDim
        , _pos = e[this.units.mouseUnit] - _info.prevOffsetStart
      
      if (!this.dragged) {
        this.dragged = true
        this.$splitbarAlias.insertAfter(_info.currentSplitbar)
        this.$splitter.data('orgSplitter').trigger($.Event('dragStart'))
        if (e.isDefaultPrevented()) return
      }      
      
      if (_pos <= _splitbarHelfDim) {
        _pos = _splitbarHelfDim
        //this.$splitbarAlias.addClass(_tmp.splitbarZombieReached);
      } else if (_pos >= _info.nextLimit) {
        _pos = _info.nextLimit    
        //this.$splitbarAlias.addClass(_tmp.splitbarZombieReached);
      }/* else {
        //this.$splitbarAlias.removeClass(_tmp.splitbarZombieReached);
      }*/
      
      _info.prevPanelDim = _pos - _splitbarHelfDim
      
      this.$splitbarAlias.css(this.units.splitbarPos, _info.prevPosStart + _info.prevPanelDim).data('currentInfo', _info)      
      this.options.realtime? this.resize() : null;      
      e.preventDefault();
    }
  , end: function (e) {     
      $('body * ').css('cursor', "")
      enableSelection.apply(this)
      
      $(document).off('mouseup.splitter.data-api')
      $(document).off('mousemove.splitter.data-api')      
      this.options.realtime? null : this.resize();
      
      this.currentInfo.currentSplitbar.removeClass('active')
      if (this.$splitbarAlias) this.$splitbarAlias.remove()
      this.$splitbarAlias = undefined
      this.dragged = false;
      this.$splitter.data('orgSplitter').trigger($.Event('dragEnd'))
      if (e.isDefaultPrevented()) return
    }
  , resize: function () {
      var _info = this.currentInfo
        , _tmp = this.options._template
        , _units = this.units
        , _offset = _info.prevPanel[_units.unit]() - _info.prevPanelDim        
        
      if (!this.dragged) return
      _info.prevPanel[_units.unit](_info.prevPanelDim)
      _info.currentSplitbar.css(_units.splitbarPos, this.$splitbarAlias.position()[_units.splitbarPos]);
      _info.nextPanel[_units.unit](_info.nextPanel[_units.unit]() + _offset).css(_units.splitbarPos, this.$splitbarAlias.position()[_units.splitbarPos] + (_units.splitbarHelfDim * 2))
      
      _info.prevPanel.add(_info.nextPanel).find('.' + _tmp.splitter).each(function (idx, item) {
        var _splitterInstance = $(item).data('orgSplitter').data('splitter')        
        position.apply(_splitterInstance, [true]);
      });
    }
  }


 /* SPLITTER PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.splitter

  $.fn.splitter = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('splitter')
        , options = $.extend({}, $.fn.splitter.defaults, typeof option == 'object' && option)
      if (!data) $this.data('splitter', (data = new Splitter(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.splitter.defaults = {
    direction: 'horizontal'
  , realtime: false    
    //private options
  , _template: {
      'splitter':               'tm-splitter'
    , 'hasSplitter':            'hasSplitter'
    , 'panel':                  'tm-splitter-panel'
    , 'panel-content':          'tm-splitter-content'    
    , 'splitbar':               'tm-splitbar'    
    , 'splitbarHandler':        'tm-splitbar-handler'
    , 'splitbarDraggable':      'tm-splitbar-draggable'
    , 'splitbarZombie':         'tm-splitbar-zombie'    
    }  
  }

  $.fn.splitter.Constructor = Splitter

 /* SPLITTER NO CONFLICT
  * ==================== */

  $.fn.splitter.noConflict = function () {
    $.fn.splitter = old
    return this
  }
  
}(window.jQuery);/*!
 * jQuery Validation Plugin 1.11.1
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright 2013 Jörn Zaefferer
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($) {

$.extend($.fn, {
  // http://docs.jquery.com/Plugins/Validation/validate
  validate: function( options ) {

    // if nothing is selected, return nothing; can't chain anyway
    if ( !this.length ) {
      if ( options && options.debug && window.console ) {
        console.warn( "Nothing selected, can't validate, returning nothing." );
      }
      return;
    }

    // check if a validator for this form was already created
    var validator = $.data( this[0], "validator" );
    if ( validator ) {
      return validator;
    }

    // Add novalidate tag if HTML5.
    this.attr( "novalidate", "novalidate" );

    validator = new $.validator( options, this[0] );
    $.data( this[0], "validator", validator );

    if ( validator.settings.onsubmit ) {

      this.validateDelegate( ":submit", "click", function( event ) {
        if ( validator.settings.submitHandler ) {
          validator.submitButton = event.target;
        }
        // allow suppressing validation by adding a cancel class to the submit button
        if ( $(event.target).hasClass("cancel") ) {
          validator.cancelSubmit = true;
        }

        // allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
        if ( $(event.target).attr("formnovalidate") !== undefined ) {
          validator.cancelSubmit = true;
        }
      });

      // validate the form on submit
      this.submit( function( event ) {
        if ( validator.settings.debug ) {
          // prevent form submit to be able to see console output
          event.preventDefault();
        }
        function handle() {
          var hidden;
          if ( validator.settings.submitHandler ) {
            if ( validator.submitButton ) {
              // insert a hidden input as a replacement for the missing submit button
              hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val( $(validator.submitButton).val() ).appendTo(validator.currentForm);
            }
            validator.settings.submitHandler.call( validator, validator.currentForm, event );
            if ( validator.submitButton ) {
              // and clean up afterwards; thanks to no-block-scope, hidden can be referenced
              hidden.remove();
            }
            return false;
          }
          return true;
        }

        // prevent submit for invalid forms or custom submit handlers
        if ( validator.cancelSubmit ) {
          validator.cancelSubmit = false;
          return handle();
        }
        if ( validator.form() ) {
          if ( validator.pendingRequest ) {
            validator.formSubmitted = true;
            return false;
          }
          return handle();
        } else {
          validator.focusInvalid();
          return false;
        }
      });
    }

    return validator;
  },
  // http://docs.jquery.com/Plugins/Validation/valid
  valid: function() {
    if ( $(this[0]).is("form")) {
      return this.validate().form();
    } else {
      var valid = true;
      var validator = $(this[0].form).validate();
      this.each(function() {
        valid = valid && validator.element(this);
      });
      return valid;
    }
  },
  // attributes: space seperated list of attributes to retrieve and remove
  removeAttrs: function( attributes ) {
    var result = {},
      $element = this;
    $.each(attributes.split(/\s/), function( index, value ) {
      result[value] = $element.attr(value);
      $element.removeAttr(value);
    });
    return result;
  },
  // http://docs.jquery.com/Plugins/Validation/rules
  rules: function( command, argument ) {
    var element = this[0];

    if ( command ) {
      var settings = $.data(element.form, "validator").settings;
      var staticRules = settings.rules;
      var existingRules = $.validator.staticRules(element);
      switch(command) {
      case "add":
        $.extend(existingRules, $.validator.normalizeRule(argument));
        // remove messages from rules, but allow them to be set separetely
        delete existingRules.messages;
        staticRules[element.name] = existingRules;
        if ( argument.messages ) {
          settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
        }
        break;
      case "remove":
        if ( !argument ) {
          delete staticRules[element.name];
          return existingRules;
        }
        var filtered = {};
        $.each(argument.split(/\s/), function( index, method ) {
          filtered[method] = existingRules[method];
          delete existingRules[method];
        });
        return filtered;
      }
    }

    var data = $.validator.normalizeRules(
    $.extend(
      {},
      $.validator.classRules(element),
      $.validator.attributeRules(element),
      $.validator.dataRules(element),
      $.validator.staticRules(element)
    ), element);

    // make sure required is at front
    if ( data.required ) {
      var param = data.required;
      delete data.required;
      data = $.extend({required: param}, data);
    }

    return data;
  }
});

// Custom selectors
$.extend($.expr[":"], {
  // http://docs.jquery.com/Plugins/Validation/blank
  blank: function( a ) { return !$.trim("" + $(a).val()); },
  // http://docs.jquery.com/Plugins/Validation/filled
  filled: function( a ) { return !!$.trim("" + $(a).val()); },
  // http://docs.jquery.com/Plugins/Validation/unchecked
  unchecked: function( a ) { return !$(a).prop("checked"); }
});

// constructor for validator
$.validator = function( options, form ) {
  this.settings = $.extend( true, {}, $.validator.defaults, options );
  this.currentForm = form;
  this.init();
};

$.validator.format = function( source, params ) {
  if ( arguments.length === 1 ) {
    return function() {
      var args = $.makeArray(arguments);
      args.unshift(source);
      return $.validator.format.apply( this, args );
    };
  }
  if ( arguments.length > 2 && params.constructor !== Array  ) {
    params = $.makeArray(arguments).slice(1);
  }
  if ( params.constructor !== Array ) {
    params = [ params ];
  }
  $.each(params, function( i, n ) {
    source = source.replace( new RegExp("\\{" + i + "\\}", "g"), function() {
      return n;
    });
  });
  return source;
};

$.extend($.validator, {

  defaults: {
    messages: {},
    groups: {},
    rules: {},
    errorClass: "error",
    validClass: "valid",
    errorElement: "label",
    focusInvalid: true,
    errorContainer: $([]),
    errorLabelContainer: $([]),
    onsubmit: true,
    ignore: ":hidden",
    ignoreTitle: false,
    onfocusin: function( element, event ) {
      this.lastActive = element;

      // hide error label and remove error class on focus if enabled
      if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
        if ( this.settings.unhighlight ) {
          this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
        }
        this.addWrapper(this.errorsFor(element)).hide();
      }
    },
    onfocusout: function( element, event ) {
      if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
        this.element(element);
      }
    },
    onkeyup: function( element, event ) {
      if ( event.which === 9 && this.elementValue(element) === "" ) {
        return;
      } else if ( element.name in this.submitted || element === this.lastElement ) {
        this.element(element);
      }
    },
    onclick: function( element, event ) {
      // click on selects, radiobuttons and checkboxes
      if ( element.name in this.submitted ) {
        this.element(element);
      }
      // or option elements, check parent select in that case
      else if ( element.parentNode.name in this.submitted ) {
        this.element(element.parentNode);
      }
    },
    highlight: function( element, errorClass, validClass ) {
      if ( element.type === "radio" ) {
        this.findByName(element.name).addClass(errorClass).removeClass(validClass);
      } else {
        $(element).addClass(errorClass).removeClass(validClass);
      }
    },
    unhighlight: function( element, errorClass, validClass ) {
      if ( element.type === "radio" ) {
        this.findByName(element.name).removeClass(errorClass).addClass(validClass);
      } else {
        $(element).removeClass(errorClass).addClass(validClass);
      }
    }
  },

  // http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
  setDefaults: function( settings ) {
    $.extend( $.validator.defaults, settings );
  },

  messages: {
    required: "This field is required.",
    remote: "Please fix this field.",
    email: "Please enter a valid email address.",
    url: "Please enter a valid URL.",
    date: "Please enter a valid date.",
    dateISO: "Please enter a valid date (ISO).",
    number: "Please enter a valid number.",
    digits: "Please enter only digits.",
    creditcard: "Please enter a valid credit card number.",
    equalTo: "Please enter the same value again.",
    maxlength: $.validator.format("Please enter no more than {0} characters."),
    minlength: $.validator.format("Please enter at least {0} characters."),
    rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
    range: $.validator.format("Please enter a value between {0} and {1}."),
    max: $.validator.format("Please enter a value less than or equal to {0}."),
    min: $.validator.format("Please enter a value greater than or equal to {0}.")
  },

  autoCreateRanges: false,

  prototype: {

    init: function() {
      this.labelContainer = $(this.settings.errorLabelContainer);
      this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
      this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
      this.submitted = {};
      this.valueCache = {};
      this.pendingRequest = 0;
      this.pending = {};
      this.invalid = {};
      this.reset();

      var groups = (this.groups = {});
      $.each(this.settings.groups, function( key, value ) {
        if ( typeof value === "string" ) {
          value = value.split(/\s/);
        }
        $.each(value, function( index, name ) {
          groups[name] = key;
        });
      });
      var rules = this.settings.rules;
      $.each(rules, function( key, value ) {
        rules[key] = $.validator.normalizeRule(value);
      });

      function delegate(event) {
        var validator = $.data(this[0].form, "validator"),
          eventType = "on" + event.type.replace(/^validate/, "");
        if ( validator.settings[eventType] ) {
          validator.settings[eventType].call(validator, this[0], event);
        }
      }
      $(this.currentForm)
        .validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
          "[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
          "[type='email'], [type='datetime'], [type='date'], [type='month'], " +
          "[type='week'], [type='time'], [type='datetime-local'], " +
          "[type='range'], [type='color'] ",
          "focusin focusout keyup", delegate)
        .validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

      if ( this.settings.invalidHandler ) {
        $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
      }
    },

    // http://docs.jquery.com/Plugins/Validation/Validator/form
    form: function() {
      this.checkForm();
      $.extend(this.submitted, this.errorMap);
      this.invalid = $.extend({}, this.errorMap);
      if ( !this.valid() ) {
        $(this.currentForm).triggerHandler("invalid-form", [this]);
      }
      this.showErrors();
      return this.valid();
    },

    checkForm: function() {
      this.prepareForm();
      for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
        this.check( elements[i] );
      }
      return this.valid();
    },

    // http://docs.jquery.com/Plugins/Validation/Validator/element
    element: function( element ) {
      element = this.validationTargetFor( this.clean( element ) );
      this.lastElement = element;
      this.prepareElement( element );
      this.currentElements = $(element);
      var result = this.check( element ) !== false;
      if ( result ) {
        delete this.invalid[element.name];
      } else {
        this.invalid[element.name] = true;
      }
      if ( !this.numberOfInvalids() ) {
        // Hide error containers on last error
        this.toHide = this.toHide.add( this.containers );
      }
      this.showErrors();
      return result;
    },

    // http://docs.jquery.com/Plugins/Validation/Validator/showErrors
    showErrors: function( errors ) {
      if ( errors ) {
        // add items to error list and map
        $.extend( this.errorMap, errors );
        this.errorList = [];
        for ( var name in errors ) {
          this.errorList.push({
            message: errors[name],
            element: this.findByName(name)[0]
          });
        }
        // remove items from success list
        this.successList = $.grep( this.successList, function( element ) {
          return !(element.name in errors);
        });
      }
      if ( this.settings.showErrors ) {
        this.settings.showErrors.call( this, this.errorMap, this.errorList );
      } else {
        this.defaultShowErrors();
      }
    },

    // http://docs.jquery.com/Plugins/Validation/Validator/resetForm
    resetForm: function() {
      if ( $.fn.resetForm ) {
        $(this.currentForm).resetForm();
      }
      this.submitted = {};
      this.lastElement = null;
      this.prepareForm();
      this.hideErrors();
      this.elements().removeClass( this.settings.errorClass ).removeData( "previousValue" );
    },

    numberOfInvalids: function() {
      return this.objectLength(this.invalid);
    },

    objectLength: function( obj ) {
      var count = 0;
      for ( var i in obj ) {
        count++;
      }
      return count;
    },

    hideErrors: function() {
      this.addWrapper( this.toHide ).hide();
    },

    valid: function() {
      return this.size() === 0;
    },

    size: function() {
      return this.errorList.length;
    },

    focusInvalid: function() {
      if ( this.settings.focusInvalid ) {
        try {
          $(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
          .filter(":visible")
          .focus()
          // manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
          .trigger("focusin");
        } catch(e) {
          // ignore IE throwing errors when focusing hidden elements
        }
      }
    },

    findLastActive: function() {
      var lastActive = this.lastActive;
      return lastActive && $.grep(this.errorList, function( n ) {
        return n.element.name === lastActive.name;
      }).length === 1 && lastActive;
    },

    elements: function() {
      var validator = this,
        rulesCache = {};

      // select all valid inputs inside the form (no submit or reset buttons)
      return $(this.currentForm)
      .find("input, select, textarea")
      .not(":submit, :reset, :image, [disabled]")
      .not( this.settings.ignore )
      .filter(function() {
        if ( !this.name && validator.settings.debug && window.console ) {
          console.error( "%o has no name assigned", this);
        }

        // select only the first element for each name, and only those with rules specified
        if ( this.name in rulesCache || !validator.objectLength($(this).rules()) ) {
          return false;
        }

        rulesCache[this.name] = true;
        return true;
      });
    },

    clean: function( selector ) {
      return $(selector)[0];
    },

    errors: function() {
      var errorClass = this.settings.errorClass.replace(" ", ".");
      return $(this.settings.errorElement + "." + errorClass, this.errorContext);
    },

    reset: function() {
      this.successList = [];
      this.errorList = [];
      this.errorMap = {};
      this.toShow = $([]);
      this.toHide = $([]);
      this.currentElements = $([]);
    },

    prepareForm: function() {
      this.reset();
      this.toHide = this.errors().add( this.containers );
    },

    prepareElement: function( element ) {
      this.reset();
      this.toHide = this.errorsFor(element);
    },

    elementValue: function( element ) {
      var type = $(element).attr("type"),
        val = $(element).val();

      if ( type === "radio" || type === "checkbox" ) {
        return $("input[name='" + $(element).attr("name") + "']:checked").val();
      }

      if ( typeof val === "string" ) {
        return val.replace(/\r/g, "");
      }
      return val;
    },

    check: function( element ) {
      element = this.validationTargetFor( this.clean( element ) );

      var rules = $(element).rules();
      var dependencyMismatch = false;
      var val = this.elementValue(element);
      var result;

      for (var method in rules ) {
        var rule = { method: method, parameters: rules[method] };
        try {

          result = $.validator.methods[method].call( this, val, element, rule.parameters );

          // if a method indicates that the field is optional and therefore valid,
          // don't mark it as valid when there are no other rules
          if ( result === "dependency-mismatch" ) {
            dependencyMismatch = true;
            continue;
          }
          dependencyMismatch = false;

          if ( result === "pending" ) {
            this.toHide = this.toHide.not( this.errorsFor(element) );
            return;
          }

          if ( !result ) {
            this.formatAndAdd( element, rule );
            return false;
          }
        } catch(e) {
          if ( this.settings.debug && window.console ) {
            console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
          }
          throw e;
        }
      }
      if ( dependencyMismatch ) {
        return;
      }
      if ( this.objectLength(rules) ) {
        this.successList.push(element);
      }
      return true;
    },

    // return the custom message for the given element and validation method
    // specified in the element's HTML5 data attribute
    customDataMessage: function( element, method ) {
      return $(element).data("msg-" + method.toLowerCase()) || (element.attributes && $(element).attr("data-msg-" + method.toLowerCase()));
    },

    // return the custom message for the given element name and validation method
    customMessage: function( name, method ) {
      var m = this.settings.messages[name];
      return m && (m.constructor === String ? m : m[method]);
    },

    // return the first defined argument, allowing empty strings
    findDefined: function() {
      for(var i = 0; i < arguments.length; i++) {
        if ( arguments[i] !== undefined ) {
          return arguments[i];
        }
      }
      return undefined;
    },

    defaultMessage: function( element, method ) {
      return this.findDefined(
        this.customMessage( element.name, method ),
        this.customDataMessage( element, method ),
        // title is never undefined, so handle empty string as undefined
        !this.settings.ignoreTitle && element.title || undefined,
        $.validator.messages[method],
        "<strong>Warning: No message defined for " + element.name + "</strong>"
      );
    },

    formatAndAdd: function( element, rule ) {
      var message = this.defaultMessage( element, rule.method ),
        theregex = /\$?\{(\d+)\}/g;
      if ( typeof message === "function" ) {
        message = message.call(this, rule.parameters, element);
      } else if (theregex.test(message)) {
        message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
      }
      this.errorList.push({
        message: message,
        element: element
      });

      this.errorMap[element.name] = message;
      this.submitted[element.name] = message;
    },

    addWrapper: function( toToggle ) {
      if ( this.settings.wrapper ) {
        toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
      }
      return toToggle;
    },

    defaultShowErrors: function() {
      var i, elements;
      for ( i = 0; this.errorList[i]; i++ ) {
        var error = this.errorList[i];
        if ( this.settings.highlight ) {
          this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
        }
        this.showLabel( error.element, error.message );
      }
      if ( this.errorList.length ) {
        this.toShow = this.toShow.add( this.containers );
      }
      if ( this.settings.success ) {
        for ( i = 0; this.successList[i]; i++ ) {
          this.showLabel( this.successList[i] );
        }
      }
      if ( this.settings.unhighlight ) {
        for ( i = 0, elements = this.validElements(); elements[i]; i++ ) {
          this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
        }
      }
      this.toHide = this.toHide.not( this.toShow );
      this.hideErrors();
      this.addWrapper( this.toShow ).show();
    },

    validElements: function() {
      return this.currentElements.not(this.invalidElements());
    },

    invalidElements: function() {
      return $(this.errorList).map(function() {
        return this.element;
      });
    },

    showLabel: function( element, message ) {
      var label = this.errorsFor( element );
      if ( label.length ) {
        // refresh error/success class
        label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );
        // replace message on existing label
        label.html(message);
      } else {
        // create label
        label = $("<" + this.settings.errorElement + ">")
          .attr("for", this.idOrName(element))
          .addClass(this.settings.errorClass)
          .html(message || "");
        if ( this.settings.wrapper ) {
          // make sure the element is visible, even in IE
          // actually showing the wrapped element is handled elsewhere
          label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
        }
        if ( !this.labelContainer.append(label).length ) {
          if ( this.settings.errorPlacement ) {
            this.settings.errorPlacement(label, $(element) );
          } else {
            label.insertAfter(element);
          }
        }
      }
      if ( !message && this.settings.success ) {
        label.text("");
        if ( typeof this.settings.success === "string" ) {
          label.addClass( this.settings.success );
        } else {
          this.settings.success( label, element );
        }
      }
      this.toShow = this.toShow.add(label);
    },

    errorsFor: function( element ) {
      var name = this.idOrName(element);
      return this.errors().filter(function() {
        return $(this).attr("for") === name;
      });
    },

    idOrName: function( element ) {
      return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
    },

    validationTargetFor: function( element ) {
      // if radio/checkbox, validate first element in group instead
      if ( this.checkable(element) ) {
        element = this.findByName( element.name ).not(this.settings.ignore)[0];
      }
      return element;
    },

    checkable: function( element ) {
      return (/radio|checkbox/i).test(element.type);
    },

    findByName: function( name ) {
      return $(this.currentForm).find("[name='" + name + "']");
    },

    getLength: function( value, element ) {
      switch( element.nodeName.toLowerCase() ) {
      case "select":
        return $("option:selected", element).length;
      case "input":
        if ( this.checkable( element) ) {
          return this.findByName(element.name).filter(":checked").length;
        }
      }
      return value.length;
    },

    depend: function( param, element ) {
      return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
    },

    dependTypes: {
      "boolean": function( param, element ) {
        return param;
      },
      "string": function( param, element ) {
        return !!$(param, element.form).length;
      },
      "function": function( param, element ) {
        return param(element);
      }
    },

    optional: function( element ) {
      var val = this.elementValue(element);
      return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
    },

    startRequest: function( element ) {
      if ( !this.pending[element.name] ) {
        this.pendingRequest++;
        this.pending[element.name] = true;
      }
    },

    stopRequest: function( element, valid ) {
      this.pendingRequest--;
      // sometimes synchronization fails, make sure pendingRequest is never < 0
      if ( this.pendingRequest < 0 ) {
        this.pendingRequest = 0;
      }
      delete this.pending[element.name];
      if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
        $(this.currentForm).submit();
        this.formSubmitted = false;
      } else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
        $(this.currentForm).triggerHandler("invalid-form", [this]);
        this.formSubmitted = false;
      }
    },

    previousValue: function( element ) {
      return $.data(element, "previousValue") || $.data(element, "previousValue", {
        old: null,
        valid: true,
        message: this.defaultMessage( element, "remote" )
      });
    }

  },

  classRuleSettings: {
    required: {required: true},
    email: {email: true},
    url: {url: true},
    date: {date: true},
    dateISO: {dateISO: true},
    number: {number: true},
    digits: {digits: true},
    creditcard: {creditcard: true}
  },

  addClassRules: function( className, rules ) {
    if ( className.constructor === String ) {
      this.classRuleSettings[className] = rules;
    } else {
      $.extend(this.classRuleSettings, className);
    }
  },

  classRules: function( element ) {
    var rules = {};
    var classes = $(element).attr("class");
    if ( classes ) {
      $.each(classes.split(" "), function() {
        if ( this in $.validator.classRuleSettings ) {
          $.extend(rules, $.validator.classRuleSettings[this]);
        }
      });
    }
    return rules;
  },

  attributeRules: function( element ) {
    var rules = {};
    var $element = $(element);
    var type = $element[0].getAttribute("type");

    for (var method in $.validator.methods) {
      var value;

      // support for <input required> in both html5 and older browsers
      if ( method === "required" ) {
        value = $element.get(0).getAttribute(method);
        // Some browsers return an empty string for the required attribute
        // and non-HTML5 browsers might have required="" markup
        if ( value === "" ) {
          value = true;
        }
        // force non-HTML5 browsers to return bool
        value = !!value;
      } else {
        value = $element.attr(method);
      }

      // convert the value to a number for number inputs, and for text for backwards compability
      // allows type="date" and others to be compared as strings
      if ( /min|max/.test( method ) && ( type === null || /number|range|text/.test( type ) ) ) {
        value = Number(value);
      }

      if ( value ) {
        rules[method] = value;
      } else if ( type === method && type !== 'range' ) {
        // exception: the jquery validate 'range' method
        // does not test for the html5 'range' type
        rules[method] = true;
      }
    }

    // maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
    if ( rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength) ) {
      delete rules.maxlength;
    }

    return rules;
  },

  dataRules: function( element ) {
    var method, value,
      rules = {}, $element = $(element);
    for (method in $.validator.methods) {
      value = $element.data("rule-" + method.toLowerCase());
      if ( value !== undefined ) {
        rules[method] = value;
      }
    }
    return rules;
  },

  staticRules: function( element ) {
    var rules = {};
    var validator = $.data(element.form, "validator");
    if ( validator.settings.rules ) {
      rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
    }
    return rules;
  },

  normalizeRules: function( rules, element ) {
    // handle dependency check
    $.each(rules, function( prop, val ) {
      // ignore rule when param is explicitly false, eg. required:false
      if ( val === false ) {
        delete rules[prop];
        return;
      }
      if ( val.param || val.depends ) {
        var keepRule = true;
        switch (typeof val.depends) {
        case "string":
          keepRule = !!$(val.depends, element.form).length;
          break;
        case "function":
          keepRule = val.depends.call(element, element);
          break;
        }
        if ( keepRule ) {
          rules[prop] = val.param !== undefined ? val.param : true;
        } else {
          delete rules[prop];
        }
      }
    });

    // evaluate parameters
    $.each(rules, function( rule, parameter ) {
      rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
    });

    // clean number parameters
    $.each(['minlength', 'maxlength'], function() {
      if ( rules[this] ) {
        rules[this] = Number(rules[this]);
      }
    });
    $.each(['rangelength', 'range'], function() {
      var parts;
      if ( rules[this] ) {
        if ( $.isArray(rules[this]) ) {
          rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
        } else if ( typeof rules[this] === "string" ) {
          parts = rules[this].split(/[\s,]+/);
          rules[this] = [Number(parts[0]), Number(parts[1])];
        }
      }
    });

    if ( $.validator.autoCreateRanges ) {
      // auto-create ranges
      if ( rules.min && rules.max ) {
        rules.range = [rules.min, rules.max];
        delete rules.min;
        delete rules.max;
      }
      if ( rules.minlength && rules.maxlength ) {
        rules.rangelength = [rules.minlength, rules.maxlength];
        delete rules.minlength;
        delete rules.maxlength;
      }
    }

    return rules;
  },

  // Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
  normalizeRule: function( data ) {
    if ( typeof data === "string" ) {
      var transformed = {};
      $.each(data.split(/\s/), function() {
        transformed[this] = true;
      });
      data = transformed;
    }
    return data;
  },

  // http://docs.jquery.com/Plugins/Validation/Validator/addMethod
  addMethod: function( name, method, message ) {
    $.validator.methods[name] = method;
    $.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
    if ( method.length < 3 ) {
      $.validator.addClassRules(name, $.validator.normalizeRule(name));
    }
  },

  methods: {

    // http://docs.jquery.com/Plugins/Validation/Methods/required
    required: function( value, element, param ) {
      // check if dependency is met
      if ( !this.depend(param, element) ) {
        return "dependency-mismatch";
      }
      if ( element.nodeName.toLowerCase() === "select" ) {
        // could be an array for select-multiple or a string, both are fine this way
        var val = $(element).val();
        return val && val.length > 0;
      }
      if ( this.checkable(element) ) {
        return this.getLength(value, element) > 0;
      }
      return $.trim(value).length > 0;
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/email
    email: function( value, element ) {
      // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
      return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/url
    url: function( value, element ) {
      // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
      return this.optional(element) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/date
    date: function( value, element ) {
      return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/dateISO
    dateISO: function( value, element ) {
      return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/number
    number: function( value, element ) {
      return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/digits
    digits: function( value, element ) {
      return this.optional(element) || /^\d+$/.test(value);
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/creditcard
    // based on http://en.wikipedia.org/wiki/Luhn
    creditcard: function( value, element ) {
      if ( this.optional(element) ) {
        return "dependency-mismatch";
      }
      // accept only spaces, digits and dashes
      if ( /[^0-9 \-]+/.test(value) ) {
        return false;
      }
      var nCheck = 0,
        nDigit = 0,
        bEven = false;

      value = value.replace(/\D/g, "");

      for (var n = value.length - 1; n >= 0; n--) {
        var cDigit = value.charAt(n);
        nDigit = parseInt(cDigit, 10);
        if ( bEven ) {
          if ( (nDigit *= 2) > 9 ) {
            nDigit -= 9;
          }
        }
        nCheck += nDigit;
        bEven = !bEven;
      }

      return (nCheck % 10) === 0;
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/minlength
    minlength: function( value, element, param ) {
      var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
      return this.optional(element) || length >= param;
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/maxlength
    maxlength: function( value, element, param ) {
      var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
      return this.optional(element) || length <= param;
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/rangelength
    rangelength: function( value, element, param ) {
      var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
      return this.optional(element) || ( length >= param[0] && length <= param[1] );
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/min
    min: function( value, element, param ) {
      return this.optional(element) || value >= param;
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/max
    max: function( value, element, param ) {
      return this.optional(element) || value <= param;
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/range
    range: function( value, element, param ) {
      return this.optional(element) || ( value >= param[0] && value <= param[1] );
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/equalTo
    equalTo: function( value, element, param ) {
      // bind to the blur event of the target in order to revalidate whenever the target field is updated
      // TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
      var target = $(param);
      if ( this.settings.onfocusout ) {
        target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
          $(element).valid();
        });
      }
      return value === target.val();
    },

    // http://docs.jquery.com/Plugins/Validation/Methods/remote
    remote: function( value, element, param ) {
      if ( this.optional(element) ) {
        return "dependency-mismatch";
      }

      var previous = this.previousValue(element);
      if (!this.settings.messages[element.name] ) {
        this.settings.messages[element.name] = {};
      }
      previous.originalMessage = this.settings.messages[element.name].remote;
      this.settings.messages[element.name].remote = previous.message;

      param = typeof param === "string" && {url:param} || param;

      if ( previous.old === value ) {
        return previous.valid;
      }

      previous.old = value;
      var validator = this;
      this.startRequest(element);
      var data = {};
      data[element.name] = value;
      $.ajax($.extend(true, {
        url: param,
        mode: "abort",
        port: "validate" + element.name,
        dataType: "json",
        data: data,
        success: function( response ) {
          validator.settings.messages[element.name].remote = previous.originalMessage;
          var valid = response === true || response === "true";
          if ( valid ) {
            var submitted = validator.formSubmitted;
            validator.prepareElement(element);
            validator.formSubmitted = submitted;
            validator.successList.push(element);
            delete validator.invalid[element.name];
            validator.showErrors();
          } else {
            var errors = {};
            var message = response || validator.defaultMessage( element, "remote" );
            errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
            validator.invalid[element.name] = true;
            validator.showErrors(errors);
          }
          previous.valid = valid;
          validator.stopRequest(element, valid);
        }
      }, param));
      return "pending";
    }

  }

});

// deprecated, use $.validator.format instead
$.format = $.validator.format;

}(jQuery));

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
(function($) {
  var pendingRequests = {};
  // Use a prefilter if available (1.5+)
  if ( $.ajaxPrefilter ) {
    $.ajaxPrefilter(function( settings, _, xhr ) {
      var port = settings.port;
      if ( settings.mode === "abort" ) {
        if ( pendingRequests[port] ) {
          pendingRequests[port].abort();
        }
        pendingRequests[port] = xhr;
      }
    });
  } else {
    // Proxy ajax
    var ajax = $.ajax;
    $.ajax = function( settings ) {
      var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
        port = ( "port" in settings ? settings : $.ajaxSettings ).port;
      if ( mode === "abort" ) {
        if ( pendingRequests[port] ) {
          pendingRequests[port].abort();
        }
        pendingRequests[port] = ajax.apply(this, arguments);
        return pendingRequests[port];
      }
      return ajax.apply(this, arguments);
    };
  }
}(jQuery));

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
(function($) {
  $.extend($.fn, {
    validateDelegate: function( delegate, type, handler ) {
      return this.bind(type, function( event ) {
        var target = $(event.target);
        if ( target.is(delegate) ) {
          return handler.apply(target, arguments);
        }
      });
    }
  });
}(jQuery));
/* ============================================================
 * tm-bootstrap-validation.js v1.0.1
 * http://commercial-ui.tw.trendnet.org
 * ============================================================ */

!function ($) {

  "use strict"; // jshint ;_;


 /* VALIDATION CLASS DEFINITION
  * ==================== */

  var Validation = function (element, options) {
    this.$element = $(element);

    // combine default settings
    $.extend($.validator.defaults, $.fn.validation.defaults, options);
    // combine validation methods
    $.extend($.validator.methods, $.fn.validation.methods);
    // combine messages
    $.extend($.validator.messages, $.fn.validation.messages);

    this.$validator = this.$element.validate();
    this.options = this.$validator.settings;
  }

  Validation.prototype = {
    constructor: Validation

  , valid: function () {
      return this.$element.valid();
    }

  , rules: function (argument) {
      $(argument.element).rules(argument.command, argument.rules);
    }

  , addMethod: function (argument) {
      $.validator.addMethod(argument.name, argument.method, argument.message);
    }

  , addClassRules: function (argument) {
      $.validator.addClassRules(argument.className, argument.rules);
    }

  , format: function(argument){
      var args = [];
      for(var i in argument){
        args.push(argument[i]);
      }
      return $.validator.format.apply(null, args);
    }

  , form: function () {
      this.$validator.form();
    }

  , element: function (element) {
      this.$validator.element(element);
    }

  , resetForm: function () {
      this.$validator.resetForm();
    }

  , showErrors: function (errors) {
      this.$validator.showErrors(errors);
    }

  , numberOfInvalids: function(errors){
      return this.$validator.numberOfInvalids(errors);
    }
  }



 /* VALIDATION PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.validation

  $.fn.validation = function (option, args) {
    var values = [];
    this.each(function () {
      var $this = $(this)
        , data = $this.data('validation')
        , options = typeof option === 'object' && option;

      if (!data) $this.data('validation', data = new Validation(this, options));

      if (typeof option === 'string') { 
        if (data) {
          // check default options exists
          if ($.fn.validation.defaults[option] !== undefined) {
            if (args !== undefined) {
              // set new value on $validator instance
              data.options[option] = args;
            } else {
              // get existing $validator default value
              values.push(data.options[option]);
            }
          } 
          // check for method
          if(typeof data[option] === 'function'){
            var returnVal = data[option].call(data, args);
            // execute method and store returned values
            if(returnVal !== undefined){
              values.push(returnVal);  
            }
          }
        }
      }  
    });

    if (values.length === 1) {
      return values[0];
    }

    if (values.length > 0) {
      return values;
    } else {
      return this;
    }
  }

  $.fn.validation.defaults = {
    errorClass: 'tm-help-inline tm-help-error'
  , errorElement: 'span'
  , errorPlacement: function(label, element){
      if(element){
        if(element.is(':checkbox')){
          element.parent().append(label);
        }else{
          label.insertAfter(element);
        }
      }  
    }
  , validClass: ''
  , highlight: function ( element, errorClass, validClass ) {
    // to do: styles still undefined
    }
  , unhighlight: function ( element, errorClass, validClass ) {
    // to do: styles still undefined
    }
  }

  $.fn.validation.methods = {};
  $.fn.validation.messages = {};
  $.fn.validation.Constructor = Validation;


 /* VALIDATION NO CONFLICT
  * =============== */

  $.fn.validation.noConflict = function () {
    $.fn.validation = old
    return this
  }

}(window.jQuery);
/* ============================================================
 * bootstrap-toggler.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#toggle
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* SWITCH PUBLIC CLASS DEFINITION
  * ============================== */

  var Toggler = function (element, options) {
    this.init(element, options);
  }

  Toggler.prototype = {

      constructor: Toggler

    , init: function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, options);

        // set flags
        this.toggleOn = this.options.on;
        this.disabled = false;

        this.buildToggler();
        this.bindClickEvent();
        this.bindDragEvent();
        this.bindHoverEvent();
      }

    , buildToggler: function () {
        var opt = this.options;

        this.setDimensions(opt);

        // construct dom structure
        this.$toggler = this.$element
                          .wrap('<div class="' + this.options.classMap.toggler + '" />')
                          .parent()
                          .append($($.fn.toggler.template))
                          .css({
                              height: this.size.height
                            , width: this.size.width
                            , borderRadius: this.size.height + opt.padding + opt.borderwidth
                            , padding: opt.padding
                            , borderWidth: opt.borderwidth
                          });

        // cache elements
        this.$handle = this.$toggler.find('.' + this.options.classMap.handle);
        this.$handleBackground = this.$toggler.find('.' + this.options.classMap.background);
        this.$handleContainer = this.$toggler.find('.' + this.options.classMap.container);

        // set background wrapper border radius
        this.$handleContainer
          .find('.' + this.options.classMap.wrapper)
          .css({ borderRadius: this.size.height + opt.padding + opt.borderwidth})

        // set drag handle width
        this.$handle.css({width: this.normalizedHandleWidth + 'px'});

        // set the default toggle position
        if (this.options.on) {
          this.toggleCheckbox(true);
          this.setHandleOn();
        }
      }

      // toggle toggle on click
    , bindClickEvent: function () {
        this.$toggler.on('click', $.proxy(function (e) {
              // ignore click events on the handle
              if (e.target.className !== this.options.classMap.handle) {              
                if (this.disabled) return;
                this.expandHandleWidth(true);
                this.adjustHandleOffset();
                this.toogle(e);
              }
            }, this));
      }

      // set class states on hover
    , bindHoverEvent: function () {
        this.$toggler.hover($.proxy(function () {
          if (this.disabled) return;
          this.$toggler.toggleClass(this.options.classMap.hover);
        }, this));
      }

      // handle toggle drag
    , bindDragEvent: function () {
        this.$handle.on('mousedown', $.proxy(function (e) {

          // prevent text cursor from showing when dragging
          e.preventDefault();

          // check if toggle is disabled
          if (this.disabled) return;
          
          // set class to active
          this.$toggler.addClass(this.options.classMap.active);
        
          this.expandHandleWidth(true);
          this.adjustHandleOffset();

          // store mousedown x coordinate
          var prevMouseX = parseInt(e.pageX, 10);

          this.$handleContainer.on('mousemove', $.proxy(function (e) {
            // set class state for handle drag
            this.$toggler.addClass(this.options.classMap.drag);

            var newMouseX = this.getLeftCoordinate(prevMouseX, e);
            this.setHandlePosition(newMouseX);
            this.setBackgroundPosition(newMouseX);

          }, this));

          // bind new event for mouseup and mouseleave
          this.$handle.on(
              'mouseup'
            , $.proxy(this.unbindEvents, this));

          this.$handleContainer.on(
              'mouseleave'
            , $.proxy(this.unbindEvents, this));
        }, this));
      }

    , getLeftCoordinate: function (prevMouseX, e) {
            // cache sliding range of the handle after rendering to dom
        this.slideRange = parseInt(this.$toggler.width() - this.$handle.width(), 10);

        // calculate difference in movement
        var diff = parseInt(e.pageX, 10) - prevMouseX;
        
        // if toggle is on the diff is negative
        // so we add to subtract
        if(this.toggleOn) {
          diff = this.slideRange + diff;
        }

        // set drag boundaries
        if (diff > this.slideRange ) {
          diff = this.slideRange;
        } else if (diff < 0) {
          diff = 0;
        }   

        return diff; 
      }

    , setBackgroundPosition: function (x) {
        x = this.normalizeOffset(x);
        // set background position
        this.$handleBackground.css({left: parseInt(-this.size.width + (x + this.normalizedHandleWidth / 2), 10)  + 'px'});
      }

      // calculate left position on drag
    , setHandlePosition: function (x) {
        x = this.normalizeOffset(x);
        // set handle position
        this.$handle.css({left: x + 'px'});
      }

      // expand the handle on interaction
    , expandHandleWidth: function (bln) {
        this.$handle
          .css({
              width: (bln ? this.normalizedHandleWidth * this.options.expand: this.normalizedHandleWidth)
              // keep radius proportions after expanding handle
            , borderRadius: this.normalizedHandleWidth / 2
          });    
      }

      // normalize handle position left offset
    , normalizeOffset: function (x) {
        var togglerWidth = this.size.width;
        if (this.$toggler.hasClass(this.options.classMap.on) 
          && !this.$toggler.hasClass(this.options.classMap.drag) ) {
          x = parseInt(togglerWidth - this.normalizedHandleWidth, 10);
        }

        return x;
      }

      // adjust toggle left position due to handle expand
    , adjustHandleOffset: function () {
        var leftPos = 0;
        if(this.$toggler.hasClass(this.options.classMap.on)) {
          leftPos = parseInt(this.size.width - (this.normalizedHandleWidth * this.options.expand),10);  
        }

        this.$handle.css({left: leftPos + 'px'});
      }

      // remove previous bound events
    , unbindEvents: function (e) {
        this.$handleContainer.off('mousemove');
        this.$handleContainer.off('mouseleave');
        this.$handle.off('mouseup');

        this.toogle();
      }

    , toogle: function () {
        // drag mode
        if (this.$toggler.hasClass(this.options.classMap.drag)) {
          // determine if handle is beyond halfway threshold
          this.toggleOn = this.$handle.position().left >= (this.slideRange / 2) ? true : false;
          this.$toggler.removeClass(this.options.classMap.drag);
        } else {
          this.toggleOn = !this.toggleOn;
        }

        this.$toggler.removeClass(this.options.classMap.active);
        this.toggleCheckbox();
        this[this.toggleOn ? 'setHandleOn' : 'setHandleOff'](); 
      }

      // set checkbox checked attribute
    , toggleCheckbox: function () {
        this.$element.prop('checked', !(this.$element.prop('checked')));      
      }

    , setHandleOn: function () {
        this.transition('addClass', $.Event('toggle'));
        this.setHandlePosition(this.size.width - this.$handle.width());
        this.expandHandleWidth();
        this.setBackgroundPosition(this.size.width - this.$handle.width());
      }

    , setHandleOff: function () {
        this.transition('removeClass', $.Event('toggle'));
        this.setHandlePosition(0);
        this.expandHandleWidth();
        this.setBackgroundPosition(0);
      }

    , enable: function () {
        this.disableToggler(false);
      }

    , disable: function () {
        this.disableToggler(true);
      }

    , disableToggler: function (bln) {
        this.disabled = bln;
        this.$toggler[bln ? 'addClass' : 'removeClass'](this.options.classMap.disabled);
      }

    , setDimensions: function (opt) {
        // check for valid default size
        this.size = opt.sizeMap[opt.size] || opt.sizeMap.medium;

        // check for valid custom size
        if ($.isNumeric(opt.height) && $.isNumeric(opt.width)) {
          this.size.height = opt.height;
          this.size.width = opt.width;
        }

        // set handle width in proportion to toggler height
        this.normalizedHandleWidth = this.size.height;
      }

    , transition: function (method, toggleEvent) {
        var that = this
          , complete = function () {};

        this.$element.trigger(toggleEvent, this.$element.prop('checked'));

        if (toggleEvent.isDefaultPrevented()) return

        this.$toggler[method](this.options.classMap.on);

        $.support.transition ?
          this.$toggler.one($.support.transition.end, complete) :
          complete()
      }
  }

 /* SWITCH PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.toggler;

  $.fn.toggler = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('toggler')
        , options = $.extend({}, $.fn.toggler.defaults, $this.data(), typeof option == 'object' && option);
      if (!data) $this.data('toggler', (data = new Toggler(this, options)));
      if (typeof option === 'string') data[option]();
    })
  }

  $.fn.toggler.defaults = {
      size: 'medium'
    , expand: 1.3
    , sizeMap: {
          small: {
              height: 10
            , width: 24
          }
        , medium: {
              height: 14
            , width: 32
          }
        , large: {
              height: 18
            , width: 42
          }
      }
    , borderwidth: 1
    , padding: 2
    , height: null
    , width: null
    , on: false
    , classMap: {
          active: 'tm-toggler-active'
        , background: 'tm-toggler-background'
        , container: 'tm-toggler-container'
        , disabled: 'tm-toggler-disabled'
        , drag: 'tm-toggler-drag'
        , handle: 'tm-toggler-handle'
        , hover: 'tm-toggler-hover'
        , on: 'tm-toggler-on'
        , toggler: 'tm-toggler'
        , wrapper: 'tm-toggler-wrapper'
      }
  }

  $.fn.toggler.template = '<div class="' + $.fn.toggler.defaults.classMap.container + '"><div class="' + $.fn.toggler.defaults.classMap.wrapper + '"><div class="' + $.fn.toggler.defaults.classMap.background + '"></div></div><div class="' + $.fn.toggler.defaults.classMap.handle + '"></div></div></div>';

  $.fn.toggler.Constructor = Toggler;


 /* SWITCH NO CONFLICT
  * ================== */

  $.fn.toggler.noConflict = function () {
    $.fn.toggler = old;
    return this;
  }

}(window.jQuery);