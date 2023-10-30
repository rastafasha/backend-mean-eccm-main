const getMenuFrontEnd = (role = 'USER') => {

    const menu = [{
            titulo: 'Menu desde sidebarService',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Main', url: '/' },
                { titulo: 'progressBar', url: 'progress' },
                { titulo: 'Donas', url: 'grafica1' },
                { titulo: 'Promesas', url: 'promesas' },
                { titulo: 'Rxjs', url: 'rxjs' },
            ]
        },
        {
            titulo: 'Mantenimiento',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                // {titulo: 'Usuarios', url:'usuarios'},
                // { titulo: 'Hospitales', url: 'hospitales' },
                // { titulo: 'Medicos', url: 'medicos' },
            ]
        },
    ];

    if (role === 'ADMIN') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: 'usuarios' });
    }

    return menu;

};

module.exports = {
    getMenuFrontEnd
};