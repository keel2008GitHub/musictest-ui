export default {
    /**
     * 本地坐标 转换为 服务器需要的数据格式
     */
    positionListToYinList(list,list2){
        let result = []
       for(let item of list){
           let x = item.x
           let y = item.y
           let t = `${list2[y]}|${x+1}`
           result.push(t)
       }
       return result
    },

    yinListToPosition(list,list2){
        let result = []
       for(let item of list){
          let array = item.split('|')
         
          let y = list2.indexOf(array[0])
          let x = parseInt(array[1])-1
        //   if(y==-1||x<0){
        //     continue
        //   }
          let t = {
              x,
              y
          }
          result.push(t)
       }
       return result
    },
    // 音乐数据转换为显示文本
    yinListToDisplayList(list,list2){
        let result = []
        for(let item of list){
           let array = item.split('|')
           let t = {
               titleX:parseInt(array[1])*0.25,
               titleY:array[0]
           }
           result.push(t)
        }
        return result
    }
}