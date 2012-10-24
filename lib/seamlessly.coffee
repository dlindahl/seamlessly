win = @

class Client
  constructor : (options) ->
    @options = options

    @init()

  init : ->
    @fetchContainer()
    @build()
    @listen()

  fetchContainer : ->
    if typeof @options.el == 'string'
      @container = document.querySelectorAll( @options.el )[0]
    else
      @container = @options.el

  build : ->
    @iframe = document.createElement( 'iframe' )

    @iframe.setAttribute 'src', @options.src
    @iframe.setAttribute 'seamless', 'seamless'
    @iframe.setAttribute 'allowtransparency', true
    @iframe.setAttribute 'frameborder', 0
    @iframe.setAttribute 'scrolling', 'no'
    @iframe.setAttribute 'horizontalscrolling', 'no'
    @iframe.setAttribute 'verticalscrolling', 'no'
    @iframe.setAttribute 'role', 'application'
    @iframe.setAttribute 'width', '100%'

    @iframe.addEventListener 'load', @onLoad

    @container.appendChild @iframe

  publish : (event, msg) ->
    @iframe.contentWindow.postMessage [ event, msg ], '*'

  listen : ->
    win.addEventListener 'message', (e) =>
      event = e.data[0]
      data  = e.data[1]

      switch event
        when 'setHeight' then @setHeight(data)      

  setHeight : (height) ->
    console.log 'set height'
    @iframe.setAttribute 'height', height

  onLoad : =>
    @setReferrer()
    @copyCss()

  setReferrer : ->
    @publish 'referrer', win.location.href

  copyCss : ->
    for sheet in document.styleSheets
      for rule in sheet.rules
        @publish 'css', rule.cssText


@Seamlessly = (options) -> new Client(options)
