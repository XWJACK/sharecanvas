# Usage

- WXML
```wxml
<sharecanvas config="{{isDrawing ? config : null}}" bind:sharedImage="sharedImage"/>
```

- JS

```js
Page({
    data: {
        isDrawing: false,
        previewImage: null,
        config: null,
    },
    sharedImage: function(event) {
        wx.saveImageToPhotosAlbum({
            filePath: event.detail.tempFilePath,
            success: (data) => {
            }
        });
        this.setData({
            isDrawing: false,
            previewImage: event.detail.tempFilePath,
        });
    },
})
```

- Config

1.Common Config

| Type | Value | Optional | Defalut | Detail |
| ---- | ----- | -------- | ------- | ------ |
| type | 0/1/2 | | | Rect/Text/Image |
| top | Number | ✅ | 0 | Top for canvas |
| left | Number | ✅ | 0 | Left for canvas |
| width | Number | ✅ | 0 | Width for type <br/> ⚠️ Text width only effective when breakMode is `width` |
| height | Number | ✅ | 0 | Height for type <br/> ⚠️ Temporarily not supported for Text |
| content | Any | ✅ | "" | Rect with empty <br/> Text content text <br/> Image content url(Local or network) |
| color | String | ✅ | white/black | Color for Rect(white) or Text(black) |
| isDraw | true/false | | false | Draw |

2.Text Config Only

| Type | Value | Optional | Defalut | Detail |
| ---- | ----- | -------- | ------- | ------ |
| textAlign | left/center/right | ✅ | left | Text align for canvas |
| fontSize | Number | ✅ | 16 | Text font for canvas |
| lineHeight | Number | ✅ | 20 | Text line height, only effective for muti-line text. |
| breakMode | wrap/width/none | ✅ | none | muti-line break mode <br/> 1. wrap: break with `"\n"` <br/> 2. width: break when out of width <br/> 3. none: not break |
| maxLineNumber | Number | ✅ | 1 | ⚠️ Only effective for breakMode is `width` <br/> Out of will been display to `"..."` |



```json
{
   "canvas": {
       "width": 319,
       "height": 496,
   },
   "layers": [
       {
           "type": 0,
           
				"content": "This is Rect but content not effective.",
				
           "top": 0,
           "left": 0,
           "width": 319,
           "height": 496,

           "isDraw": true,

           "color": "#FFF",
       },
       {
           "type": 2,

           "content": "/images/main.png",

           "top": 0,
           "left": 0,
           "width": 319,
           "height": 220,

           "isDraw": true,
       },
        {
           "type": 2,

           "content": "https://path/to/image.png",

           "top": 0,
           "left": 0,
           "width": 319,
           "height": 220,

           "isDraw": true,
       },
       {
           "type": 1,
           "content": "Image From XWJACK",

           "top": 230,
           "left": 160,

           "textAlign": "center",
           "fontSize": 9,
           "color": "#707070",

           "isDraw": true,
       },
       {
           "type": 1,
           "content": "Make by Jack",

           "top": 283,
           "left": 160,

           "textAlign": "center",
           "fontSize": 12,
           "lineHeight": 22,
           "color": "#707070",

           "isDraw": true,
       },
       {
           "type": 1,
           "content": "This is text with break mode wrap.\nThis is new line.",

           "top": 392,
           "left": 160,

           "textAlign": "center",
           "fontSize": 10,
           "color": "#9B9B9B",
           "breakMode": "wrap",
           "lineHeight": 12,

           "isDraw": true,
       },
    	  {
           "type": 1,
           "content": "This is text with break mode width.",

           "top": 392,
           "left": 160,
           "width": 100,

           "textAlign": "center",
           "fontSize": 10,
           "color": "#9B9B9B",
           "breakMode": "width",
           "lineHeight": 12,
           "maxLineNumber": 1,

           "isDraw": true,
       },
       {
           "type": 1,
           "content": "This is text with break mode with none",

           "top": 458,
           "left": 23,

           "textAlign": "left",
           "fontSize": 10,
           "color": "#A1A1A1",

           "isDraw": true,
       }
   ]
}
```

# Refrence

Modify from [mp_canvas_drawer](https://github.com/kuckboy1994/mp_canvas_drawer)

