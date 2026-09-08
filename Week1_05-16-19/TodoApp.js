console.log("Todo App Initiated...");

(function update (){
    const date = new Date();
    document.getElementById('time').dateTime = date.toISOString();
    document.getElementById('time').textContent = date.toLocaleString();
    setTimeout(update,1000);
})();