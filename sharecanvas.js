/* global Component wx */

const ConfigType = {
  Rect: 0,
  Text: 1,
  Image: 2,
}

const EventType = {
  sharedImage: 'sharedImage'
}

const TextBreakMode = {
  width: 'width',
  wrap: 'wrap',
  none: 'none'
}

const TextAlign = {
  left: 'left',
  center: 'center',
  right: 'right',
}

Component({
  properties: {
    config: {
      type: Object,
      value: {layers: []},
      observer (newVal, oldVal) {
        if (!this.isPainting) {
          if (newVal && newVal.canvas.width && newVal.canvas.height) {
            this.setData({
              width: this.data.config.canvas.width,
              height: this.data.config.canvas.height,
            })
            this.isPainting = true
            this.readyPainting()
          }
        }
      }
    }
  },

  data: {
    width: 0,
    height: 0,
  },
  /// All image list.
  imageList: [],
  /// Check is aleardy painting.
  isPainting: false,
  /// Canvas context.
  ctx: null,
  /// Cache for aleardy download image.
  cache: null,

  ready () {
    this.ctx = wx.createCanvasContext('sharecanvas', this)
    this.cache = {}
  },

  methods: {
    /// Ready to painting (Download remote image to local.)
    readyPainting () {
      if (this.ctx) {
        // clearInterval(inter)
        this.ctx.clearActions()
        this.ctx.save()

        this.getImageList(this.data.config.layers)
        /// Start download image from head.
        this.downLoadImages(0)
      }
    },

    getImageList (layers) {
      var imageList = []
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === ConfigType.Image) {
          imageList.push(layers[i].content)
        }
      }
      this.imageList = imageList
      console.log('ShareCanvas: parse layer image:', imageList)
    },

    downLoadImages (index) {
      if (index < this.imageList.length) {
        this.getImageInfo(this.imageList[index]).then(file => {
          this.imageList[index] = file
          this.downLoadImages(index + 1)
        })
      } else {
        this.startPainting()
      }
    },

    getImageInfo (url) {
      let that = this
      return new Promise((resolve, reject) => {
        if (that.cache[url]) {
          resolve(that.cache[url])
        } else {
          const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
          if (objExp.test(url)) {
            wx.getImageInfo({
              src: url,
              complete: res => {
                if (res.errMsg === 'getImageInfo:ok') {
                  console.log('ShareCanvas cache from ' + url + ' to ' + res.path)
                  that.cache[url] = res.path
                  resolve(res.path)
                } else {
                  that.triggerEvent(EventType.sharedImage, {errMsg: 'sharecanvas:download fail with result' + res})
                  reject(new Error('getImageInfo fail'))
                }
              }
            })
          } else {
            that.cache[url] = url
            resolve(url)
          }
        }
      })
    },

    startPainting () {
      console.log('ShareCanvas start painting.')
      const layers = this.data.config.layers

      for (let index = 0, imageIndex = 0; index < layers.length; index++) {
        let layer = layers[index];
        
        if (!layer.isDraw) {
          continue
        }

        if (layer.type === ConfigType.Image) {
          this.drawImage({
            ...layer,
            url: this.imageList[imageIndex]
          })
          imageIndex++
        } else if (layer.type === ConfigType.Text) {
          if (!this.ctx.measureText && layer.breakMode === TextBreakMode.width) {
            this.triggerEvent(EventType.sharedImage, {errMsg: 'sharecanvas: Version need to >= 1.9.90 '})
            return
          } else {
            this.drawText(layer)
          }
        } else if (layer.type === ConfigType.Rect) {
          this.drawRect(layer)
        }
      }
      this.ctx.draw(false, () => {
        this.saveImageToLocal()
      })
    },

    saveImageToLocal () {
      console.log('ShareCanvas begin save to local. size:%f-%f', this.data.width, this.data.height)
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: this.data.width,
        height: this.data.height,
        canvasId: 'sharecanvas',
        complete: res => {
          console.log('ShareCanvas save canvas to local with result:', res)
          if (res.errMsg === 'canvasToTempFilePath:ok') {
            this.imageList = []
            this.isPainting = false
            this.triggerEvent(EventType.sharedImage, {tempFilePath: res.tempFilePath, errMsg: 'sharecanvas:ok'})
          } else {
            this.triggerEvent(EventType.sharedImage, {errMsg: 'sharecanvas:fail'})
          }
        }
      }, this)
    },

    drawImage (params) {
      console.log('ShareCanvas draw image with params:', params)
      this.ctx.save()
      const { url, top = 0, left = 0, width = 0, height = 0 } = params
      // if (borderRadius) {
      //   this.ctx.beginPath()
      //   this.ctx.arc(left + borderRadius, top + borderRadius, borderRadius, 0, 2 * Math.PI)
      //   this.ctx.clip()
      //   this.ctx.drawImage(url, left, top, width, height)
      // } else {
      this.ctx.drawImage(url, left, top, width, height)
      // }
      this.ctx.restore()
    },
    drawText (params) {
      console.log('ShareCanvas draw text with params:', params)
      this.ctx.save()

      const {
        content = '',
        
        top = 0,
        left = 0,
        width = 0,

        fontSize = 16,
        lineHeight = 20,
        textAlign = TextAlign.left,
        maxLineNumber = 1,
        breakMode = TextBreakMode.none,
        color = 'black',
        // bolder = false,
        // textDecoration = 'none'
      } = params
      
      // this.ctx.beginPath()
      this.ctx.setTextBaseline('normal')
      this.ctx.setTextAlign(textAlign)
      this.ctx.setFillStyle(color)
      this.ctx.setFontSize(fontSize)

      if (breakMode === TextBreakMode.none) {
        this.ctx.fillText(content, left, top)
      } else if (breakMode === TextBreakMode.wrap) {
        let splitTexts = content.split('\n')
        let fillTop = top
        for (let index = 0; index < splitTexts.length; index++) {
          let text = splitTexts[index]
          this.ctx.fillText(text, left, fillTop)
          fillTop += lineHeight
        }
      } else if (breakMode === TextBreakMode.width) {
        let fillText = ''
        let fillTop = top
        let lineNum = 1
        for (let i = 0; i < content.length; i++) {
          fillText += [content[i]]
          if (this.ctx.measureText(fillText).width > width) {
            if (lineNum === maxLineNumber) {
              if (i !== content.length) {
                fillText = fillText.substring(0, fillText.length - 1) + '...'
                this.ctx.fillText(fillText, left, fillTop)
                // this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
                fillText = ''
                break
              }
            }
            this.ctx.fillText(fillText, left, fillTop)
            // this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
            fillText = ''
            fillTop += lineHeight
            lineNum ++
          }
        }
        this.ctx.fillText(fillText, left, fillTop)
        // this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
      }
      
      this.ctx.restore()

      // if (bolder) {
      //   this.drawText({
      //     ...params,
      //     left: left + 0.3,
      //     top: top + 0.3,
      //     bolder: false,
      //     textDecoration: 'none' 
      //   })
      // }
    },
    // drawTextLine (left, top, textDecoration, color, fontSize, content) {
    //   if (textDecoration === 'underline') {
    //     this.drawRect({
    //       background: color,
    //       top: top + fontSize * 1.2,
    //       left: left - 1,
    //       width: this.ctx.measureText(content).width + 3,
    //       height: 1
    //     })
    //   } else if (textDecoration === 'line-through') {
    //     this.drawRect({
    //       background: color,
    //       top: top + fontSize * 0.6,
    //       left: left - 1,
    //       width: this.ctx.measureText(content).width + 3,
    //       height: 1
    //     })
    //   }
    // },
    drawRect (params) {
      console.log('ShareCanvas draw rect with params:', params)
      this.ctx.save()
      const { color, top = 0, left = 0, width = 0, height = 0 } = params
      this.ctx.setFillStyle(color)
      this.ctx.fillRect(left, top, width, height)
      this.ctx.restore()
    },
  }
})
