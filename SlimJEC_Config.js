/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Le credentials. svuotarle o eliminarle se non ci sono credenziali
 * (basta che non ci sia lo user),
 * ma in quel caso byassare il CORS.
 */
var jec_user = "es_user";
var jec_password = "es_password";
/**
 * Il search endpoint, può essere /_search o /index.../_search
 * @type {String}
 */
var jec_host = 'https://ghandalf-45544.infodev.wordpress.com/_search';
