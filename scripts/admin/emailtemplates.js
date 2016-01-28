// $Id: saved.js 9330 2010-10-24 22:23:56Z c_schmitz $

$(document).ready(function(){
   /* handle=$('.tabsinner').tabs(
    {
         show: loadHTMLEditor
    });
*/
    // Binds the Default value buttons for each email template subject and body text
    $('.fillin').bind('click', function(e) {
        e.preventDefault;
        var newval = $(this).attr('data-value');
        var target = $('#' + $(this).attr('data-target'));
        $(target).val(newval);
        updateCKeditor($(this).attr('data-target'),newval);
    });
});

function KCFinder_callback(url)
{
    addAttachment(window.KCFinder.target, url);
    window.KCFinder = null;

}

/**
 * Edit relevance equation for attachment
 *
 * @param e
 * @return void
 */
function editAttachmentRelevance(e)
{
        /*
        $('#attachment-relevance-editor').on('show.bs.modal', function(event) {
            console.log(event);
            alert('here');
        });
        */

        e.preventDefault();
        var target = $(this).parents('tr').find('input.relevance');
        var span = $(this).parents('tr').find('span.relevance');

        $('#attachment-relevance-editor textarea').val($(target).val());

        $('#attachment-relevance-editor').modal({
            backdrop: 'static',
            keyboard: false
        });

        $('#attachment-relevance-editor .btn-success').one('click', function (event) {
            var newRelevanceEquation = $('#attachment-relevance-editor textarea').val();
            $(target).val(newRelevanceEquation);
            $(span).html(newRelevanceEquation);

            $('#attachment-relevance-editor').modal('hide');
        });

}

/**
 * Add an attachment to this template
 *
 * @param target
 * @param url
 * @param relevance
 * @param size
 * @return void
 */
function addAttachment(target, url, relevance, size)
{
    if (typeof relevance == 'undefined')
    {
        var relevance = '1';
    }
    if (typeof size == 'undefined')
    {
        var size = '-';
    }
    var filename = decodeURIComponent(url.replace(/^.*[\\\/]/, ''));


    var baserow = '<tr>';
    // Actions
    baserow += '<td>';
    //<span class="ui-pg-button glyphicon text-danger glyphicon-trash" data-toggle="tooltip" data-placement="bottom" title="" onclick="if (confirm(&quot;Are you sure you want to delete this entry?&quot;)) { $(this).parent().submit(); }" data-original-title="Delete assessment">
    baserow += '<span title="Remove attachment" class="ui-pg-button btnattachmentremove glyphicon glyphicon-trash text-warning" data-toggle="tooltip" data-placement="bottom" data-original-title="Remove attachement"></span>';
    baserow += '</td>';

    baserow += '<td><span class="filename"></span><input class="filename" type="hidden"></td>';
    baserow += '<td><span class="filesize"></span></td>';
    baserow += '<td><span class="relevance"></span>'
    baserow += '<span title="Edit relevance equation" class="edit-relevance-equation ui-pg-button icon-edit" data-toggle="tooltip" data-placement="bottom" data-original-title="Edit relevance equation"></span>';
    baserow += '<input class="relevance" type="hidden"></td>';
    baserow += '</tr>';

    if ($(target).is('table'))
    {
        var newrow = $(baserow).clone();
        var templatetype = $(target).attr('data-template');
        var index = $(target).find('tr').length - 1;
        $(newrow).find('span.relevance').text(relevance);
        $(newrow).find('input.relevance').val(relevance).attr('name', 'attachments' + templatetype + '[' + index + '][relevance]');
        $(newrow).find('input.filename').attr('name', 'attachments' + templatetype + '[' + index + '][url]');
        $(newrow).appendTo(target);
    }
    else
    {
        var newrow = target;
    }


    $('span.edit-relevance-equation').unbind('click').bind('click', editAttachmentRelevance);
    $('.btnattachmentremove').unbind('click').bind('click', removeAttachment);

    $('span.filename').unbind('click').bind('click', function(e) {
        e.preventDefault();
        var target = $(this).parents('tr');
        openKCFinder_singleFile(target);
    });

    $(newrow).find('span.filesize').text(formatFileSize(size));
    $(newrow).find('span.filename').text(filename);
    $(newrow).find('input.filename').val(url);

}

function removeAttachment(e)
{
    e.preventDefault();
    $(this).parents('tr').remove();
}

function formatFileSize(bytes)
{
    if (bytes >= 1000000)
    {
        return (bytes / 1000000).toFixed(2) + 'MB';
    }
    else if (bytes < 1000000)
    {
        return (bytes / 1000).toFixed(0) + 'KB';
    }
    return bytes;
}

function openKCFinder_singleFile(target) {
    window.KCFinder = {};
    window.KCFinder.target = target;
    window.KCFinder.callBack = KCFinder_callback;
    window.open(LS.data.baseUrl + '/third_party/kcfinder/browse.php?opener=custom&type=files&CKEditor=email_invite_en&langCode='+sKCFinderLanguage, 'kcfinder_single', 'height=600px, width=800px, modal=yes');
}

$('#attachment-relevance-editor button').click(function()
{
    $('#attachment-relevance-editor').dialog('close');
    var relevance = $('#attachment-relevance-editor textarea').val();
    $('#attachment-relevance-editor').dialog('option', 'target').val(relevance);
    var span = $('#attachment-relevance-editor').dialog('option', 'target').parents('tr').find('span.relevance');
    if (relevance.length > 50)
    {
        $(span).text(relevance.replace(/(\r\n|\n|\r)/gm,"").substr(0, 47) + '...');
    }
    else
    {
        $(span).text(relevance);
    }

});
