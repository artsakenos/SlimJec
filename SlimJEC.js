/* 
 Created on : 25 ott 2019, 12:08:05
 Author     : artsakenos
 */
/* global jec_user, jec_password, jec_host */

window.onload = function () {
    $('#conf_url').val(getCookie("jec_host"));
    $('#conf_user').val(getCookie("jec_user"));
    $('#conf_password').val(getCookie("jec_password"));

    $('#conf_url_current').html('<small>Currently: <i>' + jec_host + '</i></small>');
    $('#conf_user_current').html('<small>Currently: <i>' + jec_user + '</i></small>');
};

/**
 * Performs a search request against an Elasticsearch server.
 * @param {string} search
 *   The string to search for.
 * @param {string} fieldsearch
 *   The field search in form of field:value
 * @param {string} limit
 *   A string to use to filter by type. For example: 'article';
 * @param {boolean} fuzzy
 *   Decide if the search is fuzzy or exact match.;
 */
function doSearch(search, limit, fieldsearch, fuzzy) {

    if (!limit) {
        limit = 10;
    }

    var body = {
        'size': limit
    };

    // If empty does nothing.
    var query = {
        bool: {
            must: [
            ]
        }
    };
    body.query = query;

    if (search) {
        var search_fuzzy = {fuzzy: {_all: search}};
        var search_match = {match: {_all: search}};
        if (fuzzy)
            query.bool.must.push(search_fuzzy);
        else
            query.bool.must.push(search_match);
    }

    if (fieldsearch) {
        var fs_type = fieldsearch.split(':')[0];
        var fs_value = fieldsearch.split(':')[1];
        var fs_match = {match: {[fs_type]: fs_value}};
        query.bool.must.push(fs_match);
    }


    var xmlHttp = new XMLHttpRequest();
    if (jec_user) {
        // xmlHttp.withCredentials = true;  // Per esplicitare la richiesta di credenziali?
        var credentials = window.btoa(jec_user + ':' + jec_password); // Senza questo chiede le credential esplicitamente.
        xmlHttp.open('POST', jec_host + "/_search", [true, jec_user, jec_password]);
        xmlHttp.setRequestHeader("Authorization", "Basic " + credentials);
    } else {
        xmlHttp.open('POST', jec_host + "/_search", false); // Senza credenziali
    }
    xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xmlHttp.onload = function (event) {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                var response = JSON.parse(xmlHttp.responseText);
                showHits(response);
            } else {
                showMessage('Connection Error (' + xmlHttp.statusText + '), check the URL ' + jec_host, 'warning');
            }
        }
    };
    xmlHttp.onerror = function (event) {
        showMessage('Connection Error (' + xmlHttp.statusText + '), check the URL ' + jec_host, 'warning');
    };

    try {
        console.log(JSON.stringify(body));
        xmlHttp.send(JSON.stringify(body));
    } catch (domexception) {
        showMessage("Attenzione: disattivare il CORS, utilizzare un repository con credentials, o alloware mixed content (se da https).", 'warning');
    }
}

function saveCredentials(url, user, password) {
    jec_host = url;
    jec_user = user;
    jec_password = password;
    setCookie("jec_host", jec_host, 30);
    setCookie("jec_user", jec_user, 30);
    setCookie("jec_password", jec_password, 30);
    showMessage('Credentials correctly saved.', 'success');
}

/**
 * Prints the results.
 * @param {type} response
 * @return {undefined}
 */
function showHits(response) {
    var html_output = '';
    for (var i = 0; i < response.hits.hits.length; i++) {
        var hit = response.hits.hits[i]._source;
        var keys = Object.keys(hit);

        // Search for a title
        if (hit.hasOwnProperty('title')) {
            html_output += '<h2>' + hit.title + '</h2>\n';
        }
        if (hit.hasOwnProperty('body')) {
            var body_cut = hit.body;
            if (body_cut.length > 200) {
                body_cut = body_cut.substring(0, 200) + "...";
            }
            html_output += '<div class="jec_field_body">' + body_cut + '</div>\n';
        }
        html_output += `<div class="jec_field_keys jec_field_wrapper">
                    <span class="jec_field_label"><i>Available Keys</i>:</span>
                    <span class="jec_field_content">${keys}</span></div>\n`;

        for (var field in hit) {
            if (field === 'title')
                continue;
            if (field === 'body')
                continue;
            if (Object.prototype.hasOwnProperty.call(hit, field)) {

                var html_value = hit[field];
                if (typeof html_value === "object") {
                    html_value = toJson(html_value);
                }

                html_output += `<div class="jec_field_${field} jec_field_wrapper">
                    <span class="jec_field_label">${field}:</span>
                    <span class="jec_field_content">${html_value}</span></div>\n`;
            }
        }

        html_output += '<hr>';
    }
    var html_total = `<h2>Showing ${response.hits.hits.length} of ${response.hits.total} results.</h2>`;
    showMessage(html_total, 'success');
    document.getElementById('hits').innerHTML = html_output;
}

/**
 * Show a notification.
 * 
 * @param {type} message
 * @param {type} type Il bootstrap button type: success, warning, info, danger, ..., 
 * https://getbootstrap.com/docs/4.0/components/buttons/
 * 
 * @return {undefined}
 */
function showMessage(message, type) {
    $("#notifications").fadeIn();
    var html_message = '<div class="alert alert-' + type + '">' + message + '</div>';
    $('#notifications').html(html_message);
    setTimeout(function () {
        $("#notifications").fadeOut("slow");
    }, 10000);
}

function showIndexes() {
    // Here I'm trying with an Ajax query.
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(jec_user + ':' + jec_password));
        },
        success: function (data) {
            document.getElementById('hits').innerHTML = '<pre>' + data + '</pre>';
        },
        error: function (data) {
            document.getElementById('hits').innerHTML = 'ERROR:' + data;
        },
        type: "GET",
        data: '',
        contentType: "application/json; charset=utf-8",
        url: jec_host + '/_cat/indices?v'
    });
}

function postData(mapping, body) {
    var postUrl = jec_host + mapping;

    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(jec_user + ':' + jec_password));
        },
        success: function (data) {
            showMessage("Item has been succesfully posted.", "success");
            document.getElementById('hits').innerHTML = toJson(data);
        },
        error: function (data) {
            showMessage("There was an error posting the item (" + postUrl + ").", "danger");
            document.getElementById('hits').innerHTML = toJson(data);
        },
        type: "POST",
        data: body,
        contentType: "application/json; charset=utf-8",
        url: postUrl
    });

}

function toJson(dataObject) {
    return '<pre id="json">' + JSON.stringify(dataObject, null, 2) + '</pre>';
}

// -----------------------------------------------------------------------------
// ---------    Cookies
// -----------------------------------------------------------------------------

// Cookies
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1);
        if (c.indexOf(name) === 0)
            return c.substring(name.length, c.length);
    }
    return "";
}

function eraseCookie(name) {
    setCookie(name, "", -1);
}
