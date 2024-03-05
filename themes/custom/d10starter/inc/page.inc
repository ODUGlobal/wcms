<?php

function d10starter_preprocess_page(&$variables) {
    $variables['infoForLinks'] = [];

    $menu_name = 'utility-dropdown';
    $menu_tree = \Drupal::menuTree();
    $parameters = $menu_tree->getCurrentRouteMenuTreeParameters($menu_name);
    $parameters->setMaxDepth(1);

    $tree = $menu_tree->load($menu_name, $parameters);
    $manipulators = [
      array('callable' => 'menu.default_tree_manipulators:checkAccess'),
      array('callable' => 'menu.default_tree_manipulators:generateIndexAndSort'),
    ];

    $tree = $menu_tree->transform($tree, $manipulators);

    foreach ($tree as $item) {
        $variables['infoForLinks'][] = [
            'title' => $item->link->getTitle(),
            'url' => $item->link->getUrlObject()->toString(),
        ];
    }

    $variables['search_query'] = \Drupal::request()->query->get('q');

    $variables['privacyPolicyLink'] = [
        'title' => t('Privacy Policy'),
        'url' => '/privacy-policy'
    ];

    $variables['utilityLinks'] = [];

    $menu_name = 'header-utility';
    $menu_tree = \Drupal::menuTree();
    $parameters = $menu_tree->getCurrentRouteMenuTreeParameters($menu_name);
    $parameters->setMaxDepth(1);

    $tree = $menu_tree->load($menu_name, $parameters);
    $manipulators = [
      array('callable' => 'menu.default_tree_manipulators:checkAccess'),
      array('callable' => 'menu.default_tree_manipulators:generateIndexAndSort'),
    ];

    $tree = $menu_tree->transform($tree, $manipulators);

    foreach ($tree as $item) {
        $variables['utilityLinks'][] = [
            'title' => $item->link->getTitle(),
            'url' => $item->link->getUrlObject()->toString(),
        ];
    }

    $variables['search_query'] = \Drupal::request()->query->get('q');

    $variables['privacyPolicyLink'] = [
        'title' => t('Privacy Policy'),
        'url' => '/privacy-policy'
    ];

    if($node = \Drupal::request()->attributes->get('node')) {
        if(is_object($node)) {
            $type = $node->getType();
            if($type == 'inquiry') {
                $variables['simple_header'] = true;
            }
        }
    }
    $configFactory = \Drupal::configFactory();
    $siteConfig = $configFactory->get('system.site');
    $siteName = $siteConfig->get('name');

    $variables['visuallyHiddenSiteTitle'] = $siteName;
    $variables['phoneLink'] = ['title' => '1-800-482-3957', 'url' => 'tel:1-800-482-3957'];
}