$(document).ready(function () {
    function animateProgressBars() {
        const languageColors = { /* ... seu objeto de cores ... */ };

        $.getJSON('languages.json', function (data) {
            const skills = data.languages;
            $.each(skills, function (skill, percentage) {
                const color = languageColors[skill] || "#444";
                const progress = `<div class="progress" data-width="${percentage}" style="background-color: ${color}; width: 0%;">
                    ${skill} <span class="percentage">${percentage}%</span>
                </div>`;
                $('.skill-bars').append($('<li>').html(progress));
            });

            $('.progress').waypoint(function () {
                const width = $(this.element).data('width');
                $(this.element).css('width', width + '%');
                this.destroy();
            }, { offset: '90%' });
        });
    }

    animateProgressBars();

    ScrollReveal().reveal('.timeline-block', {
        delay: 200, distance: '30px', duration: 1000, origin: 'bottom',
        interval: 200, viewFactor: 0.15, reset: false
    });
});