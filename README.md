scroll-view 
> 竖向滚动时，若要scroll-view的bindscroll触发
    1.scroll-view 的子元素必须为一个view包裹     
    2.scoll-y 设为true
    3.设置scroll-view的高度（不能为百分比，需为px）   
     可以在onShow（页面渲染完毕）/onLoad(页面正在渲染) 时动态设置scroll-view高度（用设备高度-页面中其他元素的高度）   

        ``` js
        let query = wx.createSelectorQuery()
        let eleHeight = 0
        query.select('#search').boundingClientRect()
        query.select('#shopcart').boundingClientRect()
        query.exec(res => {
            for(let i = 0; i < res.length; i++) {
                eleHeight += res[i].height
                console.log(res[i])
            }
            //winHeight 使用wx.getSystemInfo获取
            console.log(`winHeight:${app.globalData.winHeight},eleHeight:${eleHeight}`)
            this.setData({
                cateHeight: app.globalData.winHeight - eleHeight
            })
        })
    ```  
    
> 横向滚动时 scroll-view里使用flex  
    1.先开启属性enable-flex    
    2. scroll-view 设置如下   
         overflow:hidden; white-space: nowrap;   

> 隐藏scroll-view 滚动条

   ``` CSS
     ::-webkit-scrollbar {
         width: 0;
         height: 0;
         color: transparent;
     }
   ```     

> 
