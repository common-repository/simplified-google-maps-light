<?php

//Our class extends the WP_List_Table class, so we need to make sure that it's there
if (!class_exists('WP_List_Table')) {
    require_once(ABSPATH . 'wp-admin/includes/class-wp-list-table.php');
}

if (!class_exists("Cetabo_SGMLMap_List_Table")) {
    /**
     * It enacpsulate logic to work with lists on WP
     */
    class Cetabo_SGMLMap_List_Table extends WP_List_Table
    {

        function __construct()
        {
            //global $status, $page;
            //Set parent defaults
            parent::__construct(array(
                'singular' => 'map', //singular name of the listed records
                'plural' => 'maps', //plural name of the listed records
                'ajax' => false //does this table support ajax?
            ));
        }

        /**
         * Column configuration
         * @param type $item
         * @param type $column_name
         * @return type
         */
        function column_default($item, $column_name)
        {
            switch ($column_name) {
                case 'name':

                    //Return the title contents
                    return sprintf('%1$s <span style="color:silver"></span>%3$s',
                        /* $1%s */
                        $item->name,
                        /* $2%s */
                        $item->id,
                        /* $3%s */
                        $this->row_actions(array())
                    );

                case 'shortcode':
                    return "[cetabo_map id='{$item->id}']";

                case 'action':

                    /*$$$IS_FULL_START$$$*/
                    $actions=
                    '<div class="btn-group btn-group-sm" style="float:right">'.
                    '    <!-- <a class="btn btn-default" href="' . Cetabo_SGMLHelper::action_url('preview&id=' . $item->id) . '">View</a> -->'.
                    '    <a class="btn btn-default" href="' . Cetabo_SGMLHelper::action_url('edit&id=' . $item->id) . '">Edit</a>'.
                    '    <a class="btn btn-default remove"  map-id="' . $item->id . '" map-name="' . $item->name . '" href="#">Delete</a>'.
                    '    <a class="btn btn-default" href="' . Cetabo_SGMLHelper::action_url('export&id=' . $item->id) . '">Export</a>'.
                    '</div>';
                    /*$$$IS_FULL_END$$$*/

                    /*$$$IS_LIGHT_REGION_START$$$*/
                    $actions=
                        '<div class="btn-group btn-group-sm" style="float:right">'.
                        '    <!-- <a class="btn btn-default" href="' . Cetabo_SGMLHelper::action_url('preview&id=' . $item->id) . '">View</a> -->'.
                        '    <a class="btn btn-default" href="' . Cetabo_SGMLHelper::action_url('edit&id=' . $item->id) . '">Edit</a>'.
                        '    <a class="btn btn-default remove"  map-id="' . $item->id . '" map-name="' . $item->name . '" href="#">Delete</a>'.
                        '    <a class="btn btn-default c-disabled" href="#">Export</a>'.
                        '</div>';
                    /*$$$IS_LIGHT_REGION_END$$$*/

                    return $actions;

                default:
                    return;
            }
        }

        /**
         * Column 'selector'
         * @param type $item
         * @return type
         */
        function column_cb($item)
        {
            return sprintf("<img src='%s' style='margin-left: 10px'/>", Cetabo_SGMLResourceLoader::instance()->load_img('media/images/menu_active.png'));
        }

        /**
         * Column header
         * @return string
         */
        function get_columns()
        {
            $columns = array(
                'cb' => '',
                'name' => 'Name',
                'shortcode' => 'Shortcode',
                'action' => '',
            );
            return $columns;
        }

        /**
         * Provide columns that are used for sorting
         * @return array
         */
        function get_sortable_columns()
        {
            $sortable_columns = array(
                'name' => array('name', false), //true means it's already sorted
            );
            return $sortable_columns;
        }

        /**
         * Bulk action, not used currenty
         */
        function process_bulk_action()
        {

            //Detect when a bulk action is being triggered...
            if ('delete' === $this->current_action()) {
                wp_die('Items deleted (or they would be if we had items to delete)!');
            }
        }

        /**
         * Prepare item
         */
        function prepare_items()
        {
            $columns = $this->get_columns();
            $hidden = array();
            $sortable = $this->get_sortable_columns();

            $this->_column_headers = array($columns, $hidden, $sortable);
            $this->process_bulk_action();


            $result = Cetabo_SGMLDataProvider::instance()->get_list(15, $this->get_pagenum(), $this->get_ordering());

            $this->items = $result['items'];
            $this->set_pagination_args($result['pagination']);
        }


        /**
         * Get ordering parameters
         * @return array
         */
        function get_ordering()
        {
            $column = Cetabo_SGMLHelper::arr_get($_GET, 'orderby', null);

            if ($column != null) {
                //Handle column ordering
                $direction = Cetabo_SGMLHelper::arr_get($_GET, 'order', 'asc');
                if (!in_array($direction, array('asc', 'desc'))) {
                    $direction = 'asc';
                }
                return array('direction' => $direction, 'column' => 'name');
            }

            return array();

        }

    }
}
