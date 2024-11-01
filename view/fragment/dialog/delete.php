<script>
    jQuery(function () {
        var connection = new Cetabo.ConnectionManager({channel: 'GLOBAL'});
        jQuery('.remove').click(function (e) {
            e.preventDefault();

            var id = jQuery(this).attr('map-id');
            var name = jQuery(this).attr('map-name');
            var url = "<?php echo Cetabo_SGMLHelper::ajax_action_url('delete'); ?>&id=" + id;
            var message = {
                url: url,
                content: '',
                action: 'delete',
                callback: {
                    success: function () {
                        location.reload();
                        window.location.href =<?php echo json_encode(Cetabo_SGMLHelper::action_url('')); ?>;
                    }
                }
            };

            jQuery('#delete-dialog').modal('show');

            jQuery("#delete-dialog .modal-body").html("Delete " + name + " ? are you sure ?");
            jQuery("#delete-dialog .delete").on("click", function () {
                connection.send(message);
            });

        });
    });
</script>


<!-- Modal -->
<div class="modal fade" id="delete-dialog" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">Delete map</h4>
            </div>
            <div class="modal-body">

            </div>
            <div class="modal-footer">
                <a hred="#" class="btn btn-default" data-dismiss="modal">No</a>
                <a hred="#" class="btn btn-danger delete">Yes</a>
            </div>
        </div>
    </div>
</div>