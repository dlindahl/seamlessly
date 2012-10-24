win = @

# From http://coffeescriptcookbook.com/chapters/functions/debounce
debounce = (func, threshold, execAsap) ->
  timeout = null
  (args...) ->
    obj = this
    delayed = ->
      func.apply(obj, args) unless execAsap
      timeout = null
    if timeout
      clearTimeout(timeout)
    else if execAsap
      func.apply(obj, args)
    timeout = setTimeout delayed, threshold || 100

Embed =
  init : ->
    @subscribeToMessages()
    @listenForChanges()
    @publishSize()

  publish : (evt, msg) ->
    win.parent.postMessage [evt, msg], '*'

  publishSize : debounce (->
    Embed.publish 'setHeight', document.querySelector('html').offsetHeight
  ), 50

  listenForChanges : ->
    target = document.querySelector( 'html' )

    observer = new WebKitMutationObserver @onMutation
  
    config =
      attributes    : true
      childList     : true
      characterData : true
      
    observer.observe target, config

  subscribeToMessages : ->
    win.addEventListener 'message', @onMessage, false

  onMessage : (e) ->
    eventName = e.data[0]
    eventName = eventName[0].toUpperCase() + eventName.slice(1)
    data      = e.data[1]

    fn = Embed["on#{eventName}"]

    fn.call( Embed, data ) if fn

  onMutation : =>
    @resize()

  onReferrer : (data) ->
    base = document.createElement 'base'

    base.setAttribute 'href',   data
    base.setAttribute 'target', '_parent'

    document.getElementsByTagName('head')[0].appendChild base

  onCss : (data) ->
    style = document.createElement( 'style' )
    style.innerHTML = data

    document.getElementsByTagName('head')[0].appendChild style

    @publishSize()

Embed.init()
