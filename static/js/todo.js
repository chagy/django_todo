$(document).ready(function(){
    var csrfToken = $("input[name=csrfmiddlewaretoken]").val();

    $("#createButton").click(function(){
        var serializedData = $("#createTaskForm").serialize();

        $.ajax({
            url: $("#createTaskForm").data('url'),
            data: serializedData,
            type: 'POST',
            success: function(response){
                $("#taskList").append(`
                <div class="card mb-1" id="taskCard" data-id="${response.task.id}">
                    <div class="card-body">
                        ${response.task.title}

                        <button class="close float-right" type="button">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>`)
            }
        })

        $("#createTaskForm")[0].reset();
    })

    $("#taskList").on("click",'.card',function(){
        let dataId = $(this).data('id');

        $.ajax({
            url: '/tasks/'+dataId+'/completed/',
            data: {
                csrfmiddlewaretoken: csrfToken,
                id: dataId
            },
            type: 'POST',
            success : function() {
                var cardItem = $('#taskCard[data-id="'+dataId+'"]');
                cardItem.css('text-decoration','line-through').hide().slideDown();
                $("#taskList").append(cardItem);
            }
        })
    }).on("click","button.close",function(event){
        event.stopPropagation()
        console.log($(this));
        var dataId = $(this).data('id')

        $.ajax({
            url: `/tasks/${dataId}/delete/`,
            data: {
                csrfmiddlewaretoken: csrfToken,
                id: dataId
            },
            type: 'POST',
            dataType: 'json',
            success: function(){
                $('#taskCard[data-id="'+ dataId +'"]').remove();
            }
        })
    });
});