function getParentsChildren(element) {
    var parent = element.parentElement;
    return Array.prototype.slice.call(parent.children);
}

function setEnterAsTab(inputFields) {
    inputFields.forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Förhindra standardbeteendet för Enter-tangenten
                const inputs = Array.from(inputFields);
                let index = inputs.indexOf(this) + 1;
                if (index >= inputs.length) index = 0;
                inputs[index].focus(); // Flytta fokus till nästa input
            }
        });
    });
}