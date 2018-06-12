/*
 * Show / Hide the Sidebar for Mobile Views
 */

$(document)
    .ready(() => {
        // Set Your Classes Here
        const sidebarClass = 'sidebar--mobile';
        const sidebarToggleClass = 'sidebar--mobile-toggle';

        // The rest is automatically handled.
        const sC = $(`.${sidebarClass}`);
        const sTC = $(`.${sidebarToggleClass}`);

        // Set the sidebar class to hidden on load.
        sC.addClass(`${sidebarClass}--hidden`);

        // Setup toggle button for sidebar.
        sTC.click((e) => {
            // A button should be used for this, but if a link is stop default action.
            e.preventDefault();

            // Load in toggle button for manipulation.
            const sT = $(e.currentTarget);

            // Check if sidebar currently has visible class attached.
            if (sC.hasClass(`${sidebarClass}--visible`)) {
                // If yes, remove active class from toggle.
                sT.removeClass(`${sidebarToggleClass}--active`);

                // Also remove visible class and add hidden class to hide sidebar.
                sC.removeClass(`${sidebarClass}--visible`);
                sC.addClass(`${sidebarClass}--hidden`);
            } else {
                // If no, add active class to toggle.
                sT.addClass(`${sidebarToggleClass}--active`);

                //  Also remove hidden class and add visible class to show sidebar.
                sC.removeClass(`${sidebarClass}--hidden`);
                sC.addClass(`${sidebarClass}--visible`);
            }
        });
    });
