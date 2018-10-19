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


- Example JSON

```json
{
	"canvas": {
       "parameters": {
           "height": 496,
           "width": 319
       },
   },
   "layers": [
       {
           "isDraw": true,
           "parameters": {
               "color": "#FFF",
               "height": 496,
               "left": 0,
               "top": 0,
               "width": 319
           },
           "type": 0
       },
       {
           "content": "https://www.baidu.com/xxx.png",
           "isDraw": true,
           "parameters": {
               "height": 220,
               "left": 0,
               "top": 0,
               "width": 319
           },
           "type": 2
       },
       {
           "content": "It's only a matter of time.",
           "isDraw": true,
           "parameters": {
               "color": "#373737",
               "fontSize": 12,
               "left": 160,
               "lineHeight": 22,
               "textAlign": "center",
               "top": 283
           },
           "type": 1
       },
       {
           "content": "---- Jack",
           "isDraw": true,
           "parameters": {
               "breakMode": "none",
               "color": "#373737",
               "fontSize": 12,
               "left": 130,
               "lineHeight": 12,
               "maxLineNumber": 3,
               "textAlign": "left",
               "top": 353
           },
           "type": 1
       },
   ]
}
```

# Refrence

Modify from [mp_canvas_drawer](https://github.com/kuckboy1994/mp_canvas_drawer)

