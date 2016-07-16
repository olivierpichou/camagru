/**
 * Created by opichou on 7/14/16.
 */

var likes_counter = [0];






window.onload = function() {
    var cama_model = document.getElementById('cama_model');
    var gallery = document.getElementById('gallery');
    var cama_count = 0;
    var current_page = 1;
    var width = 1280;
    var height = 720;
    var user_id = document.getElementById("user_id").getAttribute('value');
    console.log(user_id);



    function add_cama(cama) {
        if (cama && cama.url && cama.id && cama.user_id && (cama != "error")) {
            console.log("new image being created");
            var camagru = document.createElement("div");
            camagru.setAttribute('id', cama.id);
            if (gallery) {
                camagru.classList.add("cama_preview");
                camagru.innerHTML = cama_model.innerHTML;
                camagru.setAttribute('id', cama.id);
                var tmp_img = camagru.getElementsByTagName('img');
                var tmp_input = camagru.getElementsByTagName('input');
                tmp_img[0].src = cama.url;
                tmp_input.name = "photo_id_"+cama_count;
                tmp_input.value = cama.id;
                gallery.appendChild(camagru);
                camagru = document.getElementById(cama.id);
                if (user_id != cama.user_id) {
                    var option_tab = document.createElement('div');
                    option_tab.innerHTML = '<div class="cama cama_like">O</div>';
                    option_tab.addEventListener('click', function() {
                        var user_id = document.getElementById("user_id").getAttribute('value');
                        var photo_id = this.parentNode.getAttribute('id');
                        var ajax = new XMLHttpRequest();
                        var form_data = new FormData();
                        form_data.append('photo_id', photo_id);
                        form_data.append('user_id', user_id);
                        ajax.open('POST', 'like_camagru.php', true);
                        ajax.onreadystatechange = function() {
                            if (ajax.readyState == 4 && ajax.status == 200) {
                                console.log("photo " + photo_id + "liked by" + user_id);
                                if (ajax.responseText == "1") {
                                    likes_counter[photo_id]++;
                                    document.getElementById(photo_id).getElementsByClassName('cama_like_count')[0].innerHTML = likes_counter[photo_id] + " likes";
                                }
                            }
                        }
                        ajax.send(form_data);
                    });
                } else {
                    var option_tab = document.createElement('div');
                    option_tab.innerHTML = '<div class="cama cama_delete" onclick="delete_cama(this)">X&nbsp;&nbsp;</div>';
                    option_tab.addEventListener('click', function(){
                        var tmp_id = elem.parentNode.getAttribute('id');
                        var ajax = new XMLHttpRequest();
                        ajax.open("GET", 'delete_camagru.php?id='+tmp_id, true);
                        ajax.onreadystatechange = function() {
                            if (ajax.readyState == 4 && ajax.status == 200) {
                                    console.log(ajax.responseText);
                                if (ajax.responseText == "1") {
                                    elem.parentNode.remove();
                                }
                            }
                        };
                        ajax.send();
                    });
                }
                camagru.appendChild(option_tab);
                if ( isNaN(parseInt(cama.likes)) || cama.likes == 0) {
                    likes_counter[cama.id] = '0';
                }
                else {
                    likes_counter[cama.id] = cama.likes;
                }
                camagru.getElementsByClassName('cama_like_count')[0].innerHTML = likes_counter[cama.id]+" likes";
                cama_count += 1;
                return 1;
            } else {
                console.log("error appending child");
                return 0;
            }

        }
    }

    


    function pageload(page){
        console.log("loading page");
        var ajax = new XMLHttpRequest();
        var form_data = new FormData();
        form_data.append('page', current_page);
        ajax.open('POST', 'load_photos.php', true);
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                console.log('receiving ajax');
                console.log(ajax.responseText);
                if (ajax.responseText != "" && ajax.responseText != "error") {
                    var dataset = JSON.parse(ajax.responseText);
                    console.log(dataset);
                    if (dataset == "error") {
                        console.log("error on loading page content");
                        return 0;
                    }
                    current_page++;
                    dataset.forEach(function(current) {
                        add_cama(current);
                    });
                }
            }
        };
        ajax.send(form_data);
        return 1;
    }
    pageload(current_page);
};
