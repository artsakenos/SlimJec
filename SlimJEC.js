/* 
 Created on : 25 ott 2019, 12:08:05
 Author     : artsakenos
 */
/* global jec_user, jec_password, jec_host */

/**
 * Performs a search request against an Elasticsearch server.
 * @param {string} needle
 *   The string to search for.
 * @param {string} filter
 *   A string to use to filter by type. For example: 'article';
 */
function doSearch(search, limit, fuzzy) {

    if (!limit) {
        limit = 10;
    }

    var body = {
        'size': limit
    };

    if (search) {
        var fuzzy_match = {_all: search};
        var query = {};
        if (fuzzy)
            query.fuzzy = fuzzy_match;
        else
            query.match = fuzzy_match;
        body.query = query;
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
        // console.log(JSON.stringify(body));
        xmlHttp.send(JSON.stringify(body));
    } catch (domexception) {
        showMessage("Attenzione: disattivare il CORS, utilizzare un repository con credentials, o alloware mixed content (se da https).", 'warning');
    }
}

function saveCredentials(url, user, password) {
    jec_host = url;
    jec_user = user;
    jec_password = password;
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

                html_output += `<div class="jec_field_${field} jec_field_wrapper">
                    <span class="jec_field_label">${field}:</span>
                    <span class="jec_field_content">${hit[field]}</span></div>\n`;
            }
        }

        html_output += '<hr>';
    }
    var html_total = `<h2>Showing ${response.hits.hits.length} of ${response.hits.total} results.</h2>`;
    showMessage(html_total, 'success');
    document.getElementById('hits').innerHTML = html_output;
}

/**
 * 
 * @param {type} message
 * @param {type} type Il bootstrap button type: success, warning, ...
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

/**
 * TODO:
 * togliere il _search dall'url
 */