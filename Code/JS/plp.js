var exploreId = localStorage.getItem("explore id");
var obj = JSON.parse(localStorage.getItem("products"));
function setCart() {
  if (result.length == 0 || undefined) {
    $(".modal-body").css("display", "none");

    $(".modal-title").append(" <b>My Cart</b>");

    $(".content-aside > p").css("display", "none");
    $(".content .add").css("display", "none");
    $(".cart-empty").css("display", "block");
    $(".content-aside .shop").css("display", "block");
    $(".content-aside .proceed").css("display", "none");
    $(".cart span").text("0 item");
  } else {
    $(".content-aside p").css("display", "block");
    $(".cart-empty").css("display", "none");
    $(".cart span").text(result.length + " item");
    $(".content .add").css("display", "block");
    $(".modal-title").append(" <b>My Cart</b>(" + result.length + " item)");
    $(".modal-body").css("display", "block");
    $(".content-aside .shop").css("display", "none");
    $(".content-aside .proceed").css("display", "block");
  }
}
if (obj != null) {
  var totalRes = [];
  var dataArr = obj.map((obj) => {
    return [obj.id, obj];
  });
  var maparr = new Map(dataArr);
  var result = [...maparr.values()];
  $(document).ready(function () {
    $(function () {
      setProduct();
      setCart();
    });
  });
} else if (obj == null) {
  localStorage.setItem("products", "[]");
  var result = [];
  $(document).ready(function () {
    $(function () {
      setCart();
    });
  });
}
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
      "Rs." + totalRes.reduce((a, b) => a + b, 0) + "   >"
    );
  }
}
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

$.get(
  "http://localhost:3000/server/categories/index.get.json",
  function (data) {
    $.each(data, function (index) {
      if (data[index].order != -1) {
        if (
          ($("#leftCol").css("display") == "none"
            ? ".dropdown-menu"
            : ".nav-stacked") == ".nav-stacked" ||
          ".dropdown-menu"
        )
          $(".nav-stacked").append(
            "<li  style= order:" +
              data[index].order +
              "><a class='navClass' id=" +
              data[index].id +
              ">" +
              data[index].name +
              "</a></li>"
          );
        $(".drop").append(
          "<li  style= order:" +
            data[index].order +
            "><a class='navClass' id=" +
            data[index].id +
            ">" +
            data[index].name +
            "</a></li>"
        );
      }
    });

    $(".navClass").click(function () {
      if ("dropdown-menu") {
        var dropname = $(this).text();
        $(".dropdown button").html(dropname);
      }
      idProd = $(this).attr("id");
      $("#mainCol").empty();
      change(idProd);

      function change(idProd) {
        $.get(
          "http://localhost:3000/server/products/index.get.json",
          function (data) {
            $.each(data, function (index) {
              if (idProd == data[index].category) {
                $("#mainCol").append(
                  "<div class='col-lg-3 col-md-3 col-sm-3 prod'><h5><b>" +
                    data[index].name +
                    "</b></h5><img id=" +
                    data[index].category +
                    " style='width:100%' alt='' src=" +
                    data[index].imageURL +
                    "><p class='description'>" +
                    data[index].description +
                    "</p><div class='price'><p>MRP Rs." +
                    data[index].price +
                    "</p><button class=' btn btn_color' id=" +
                    data[index].id +
                    " onclick='addToCart(id)'>Buy Now</button class='btn'></div><div class='border_l'></div></div>"
                );
              }
            });
          }
        );
      }
    });
  }
);

$(document).ready(function () {
  if (
    $("#leftCol").css("display") == "none" ? "dropdown-menu" : ".nav-stacked"
  ) {
    if (exploreId) {
      $.get(
        "http://localhost:3000/server/categories/index.get.json",
        function (data) {
          $.each(data, function (index) {
            if (exploreId == data[index].id) {
              var dropname = data[index].name;
              $(".dropdown button").html(dropname);
            }
          });
        }
      );
      $("#mainCol").empty();

      $.get(
        "http://localhost:3000/server/products/index.get.json",
        function (data) {
          $.each(data, function (index) {
            if (exploreId == data[index].category || exploreId == 0) {
              $("#mainCol").append(
                "<div class='col-lg-3 col-md-3 col-sm-3 prod'><h5><b>" +
                  data[index].name +
                  "</b></h5><img id=" +
                  data[index].category +
                  " style='width:100%' alt='' src=" +
                  data[index].imageURL +
                  "><p class='description'>" +
                  data[index].description +
                  "</p><div class='price'><p>MRP Rs." +
                  data[index].price +
                  "</p><button class=' btn btn_color' id=" +
                  data[index].id +
                  " onclick='addToCart(id)'>Buy Now</button class='btn'></div><div class='border_l'></div></div>"
              );
            }
          });
        }
      );
      localStorage.setItem("explore id", 0);
    }
  }
});

var arrobj = [];
function addToCart(id) {
  count = 0;
  $(".product").empty();
  $(".modal-title").empty();
  $.get(
    "http://localhost:3000/server/products/index.get.json",
    function (data) {
      var prod = data.find((val) => val.id === id);
      var obj = JSON.parse(localStorage.getItem("products"));
      if (obj == null) {
        obj = [];
      }
      obj.push(prod);
      localStorage.setItem("products", JSON.stringify(obj));
      var obj = JSON.parse(localStorage.getItem("products"));

      for (var i = 0; i < obj.length; i++) {
        if (prod.id == obj[i].id) {
          count++;
        }
      }
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
  fetch("http://localhost:3000/server/addToCart/index.post.json")
    .then((response) => response.json())
    .then((data) => console.log(data));
}
