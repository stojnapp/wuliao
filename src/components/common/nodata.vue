<template>
     <div id="box_content" class="bg_white pos_r">
        <div class="main_box bg_white">
            <div class="nodata">
                <img src="../static/img/my_task_no@3x.png" alt="">
                <p class="text_999 f_14">{{info}}</p>
            </div>
        </div>
     </div>  
</template>
<script>
export default {
    props:{
        info:{
          type: String, 
          default: '暂无数据显示',
       },
    }
}
</script>
<style type="text/css" scope>
    .nodata{
        display: flex;
        width: 100%;
        height: 100%;
        flex-flow: nowrap column;
        justify-content: center;
        align-items: center;
    }
    .nodata img{
        max-width: 60%;
    }
</style>


