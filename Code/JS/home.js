var obj = JSON.parse(localStorage.getItem("products"));
function setCart() {
  if (result.length == 0 || undefined) {
    $(".modal-body").css("display", "none");

    $(".modal-title").append(" <b>My Cart</b>");

    $(".content-aside > p").css("display", "none");
    $(".content .add").css("display", "none");
    $(".cart-empty").css("display", "block");
    $(".content-aside button")
      .attr("data-dismiss", "modal")
      .text("Start Shopping");

    $(".cart span").text("0 item");
  } else {
    $(".cart span").text(result.length + " item");
    $(".modal-title").append(" <b>My Cart</b>(" + result.length + " item)");
    $(".modal-body").css("display", "block");
  }
}
if (obj != null) {
  var totalRes = [];
  var dataArr = obj.map((obj) => {
    return [obj.id, obj];
  });
  var maparr = new Map(dataArr);

  var result = [...maparr.values()];

  function setProduct() {
    if (result.length != 0) {
      for (var i = 0; i < result.length; i++) {
        obj = JSON.parse(localStorage.getItem("products"));
        prod = obj.find((val) => val.id === result[i].id);
        var count = localStorage.getItem(prod.id);
        $(".product").append(
          "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 items'><img alt='' src=" +
            result[i].imageURL +
            "><div class='desc col-lg-12 col-md-12 col-sm-12 col-xs-12'><p><b>" +
            result[i].name +
            "</b></p><div class='bot'><button class ='dec btn btn_color' onclick='dec(id)' id=" +
            result[i].id +
            ">-</button id=" +
            result[i].id +
            ">" +
            count +
            "<button class='inc btn btn_color' onclick='inc(id)' id=" +
            result[i].id +
            ">+</button>  * Rs." +
            result[i].price +
            "<span class='total'>" +
            result[i].price * count +
            "</span></div></div></div>"
        );
        totalRes.push(result[i].price * count);
      }
      $(".content-aside span").text(
        "Rs." + totalRes.reduce((a, b) => a + b, 0) + "  >"
      );
    }
  }

  $(document).ready(function () {
    $(function () {
      setProduct();
      setCart();
    });
  });
  function dec(id) {
    $(".product").empty();
    $(".modal-title").empty();
    var obj = JSON.parse(localStorage.getItem("products"));
    var prod = obj.find((val) => val.id === id);
    for (var i = 0; i < obj.length; i++) {
      if (prod.id == obj[i].id) {
        var arrid = i;
      }
    }
    if (prod.id == id) {
      var count = localStorage.getItem(prod.id);

      if (count < 1) {
        obj.splice(i, 1);
      } else if (count == 1) {
        count = count - 1;

        obj.splice(arrid, 1);
      } else {
        count = count - 1;

        obj.splice(arrid, 1);
      }
    }
    localStorage.setItem("products", JSON.stringify(obj));
    localStorage.setItem(prod.id, count);
    obj = JSON.parse(localStorage.getItem("products"));
    dataArr = obj.map((obj) => {
      return [obj.id, obj];
    });
    maparr = new Map(dataArr);

    result = [...maparr.values()];
    totalRes = [];
    setProduct();
    setCart();
  }
  function inc(id) {
    $(".product").empty();
    $(".modal-title").empty();
    var obj = JSON.parse(localStorage.getItem("products"));
    var prod = obj.find((val) => val.id === id);
    $.get(
      "http://localhost:3000/server/products/index.get.json",
      function (data) {
        $.each(data, function (index) {
          if (prod.id == data[index].id) {
            count = localStorage.getItem(prod.id);
            if (count <= data[index].stock) {
              count = Number(count) + 1;
              localStorage.setItem(prod.id, count);
              obj.push(data[index]);
            }
          }
        });
        localStorage.setItem("products", JSON.stringify(obj));
        localStorage.setItem(prod.id, count);
        obj = JSON.parse(localStorage.getItem("products"));
        dataArr = obj.map((obj) => {
          return [obj.id, obj];
        });
        maparr = new Map(dataArr);

        result = [...maparr.values()];
        totalRes = [];
        setProduct();
        setCart();
      }
    );
  }
} else if (obj == null) {
  localStorage.setItem("products", "[]");
  var result = [];
  localStorage.setItem("explore id", 0);
  $(document).ready(function () {
    $(function () {
      setCart();
    });
  });
}
$.get(
  "http://localhost:3000/server/banners/index.get.json",

  function (data) {
    $.each(data, function (index) {
      $(".carousel-inner").append(
        "<div class='item'><img alt='' src=" +
          data[index].bannerImageUrl +
          "></div>"
      );
      if (index == 0) {
        $(".item").attr("class", "item active");
      }
    });
  }
);

$.get(
  "http://localhost:3000/server/categories/index.get.json",
  function (data) {
    $.each(data, function (index) {
      if (data[index].order != -1) {
        $(".category").append(
          "<div class='cat' style= order:" +
            data[index].order +
            "><img class='col-lg-4 col-md-4 c-sm-4 col-xs-4' alt='' src=" +
            data[index].imageUrl +
            "><span class='col-lg-8 col-md-8 col-sm-8 col-xs-8 descrip' style='order:" +
            data[index].order +
            "'><b>" +
            data[index].name +
            "</b><p>" +
            data[index].description +
            "</p><button onclick=window.location.href='../HTML/plp.html' id=" +
            data[index].id +
            " class='explore btn btn_color'>Explore " +
            data[index].key +
            "</button></span></div><hr style='order:" +
            data[index].order +
            "' class='hr2 col-lg-12 col-md-12 col-sm-12 col-xs-12'> "
        );
      }
    });

    $(function () {
      $(".explore").click(function () {
        var exp = $(this).attr("id");
        localStorage.setItem("explore id", exp);
      });
    });
  }
);
