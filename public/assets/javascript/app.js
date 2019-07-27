function addZ(n) { return n < 10 ? '0' + n : '' + n; }

$(document).ready(() =>{
    $(".clear").on("click", () => $("#comment-text").val(""));

    $("#articleModal").on("show.bs.modal", event => {
        let button = $(event.relatedTarget);
        let id = button.data('id');
        let modal = $(this);

        $(".modal").data("id", id);

        $.ajax({
            method: "GET",
            url: "/notes/" + id
        })
        .then(data => {
            console.log(data);

            // If there's a note in the article
            if (data.note) {
                let group = $(".modal-list");
                group.empty();
                data.note.forEach(element => {
                    let item = $("<li>").addClass("list-group-item").data("id", element._id);
                    let div = $("<div>").addClass("d-flex w-100 justify-content-between");
                    let content = $("<h5>").addClass("mb-1").text(element.note);
                    let fullDate = new Date(element.date)
                    let date = $("<small>").text(addZ(fullDate.getHours()) + ":" + addZ(fullDate.getMinutes()) + " " + addZ(fullDate.getMonth()) + "/" + addZ(fullDate.getDate()) + "/" + addZ(fullDate.getFullYear()));
                    let button = $("<button>").addClass("btn btn-primary delete").text("Delete");
                    div.append(content);
                    div.append(date);
                    item.append(div);
                    item.append(button);
                    group.append(item);
                });
            }
        });
    });

    $(".addComment").on("click", () => {
        let id = $(".modal").data("id");
        let comment = $("#comment-text").val();
        $.ajax({
            method: "POST",
            url: "/notes/" + id,
            data: {
                note: comment
            }
        })
        .then(data => {
            let item = $("<li>").addClass("list-group-item");
            let div = $("<div>").addClass("d-flex w-100 justify-content-between");
            let content = $("<h5>").addClass("mb-1").text(comment);
            let D = new Date();
            let date = $("<small>").text(addZ(D.getHours()) + ":" + addZ(D.getMinutes()) + " " + addZ(D.getMonth()) + "/" + addZ(D.getDate()) + "/" + addZ(D.getFullYear()));
            let button = $("<button>").addClass("btn btn-primary delete").text("Delete");
            div.append(content);
            div.append(date);
            item.append(div);
            item.append(button);
            $(".modal-list").prepend(item);
            $("#comment-text").val("");
        });
    });

    $(document).on("click", ".delete", (event) => {
        if ($(event.target).parent().data("id")) {
            let id = $(event.target).parent().data("id");
            let articleId = $(".modal").data("id");
            $.ajax({
                method: "DELETE",
                url: "/notes/" + id,
                data: {
                    id: articleId
                }
            })
            .then(data => {
                if (data) console.log(data);
                console.log("completed");
            })
        }
        $(event.target).parent().remove();
    });

    $(".discover").on("click", () => {
        $.ajax({
            method: "GET",
            url: "/scrape"
        })
        .then(() => {
            location.reload();
        })
    })
});