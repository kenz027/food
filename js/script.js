window.addEventListener('DOMContentLoaded', ()=>{
    //tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
    tabs_content = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items');
    function hideTabContent(){
        tabs_content.forEach(item=>{
            item.style.display='none';
        })
        tabs.forEach(item=>{
            item.classList.remove('tabheader__item_ative');
        })
    }
    function showTabContent(i=0){
        tabs_content[i].style.display='block';
        tabs[i].classList.add('tabheader__item_ative');
    }
    hideTabContent();
    showTabContent();
    tabsParent.addEventListener('click', (e)=>{
        const target = e.target;
        if (target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i)=>{
                if (target == item){
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //timer
    const deadline = '2022-12-12, 23:21:30';
    function getTime(endtime){
        const time = Date.parse(deadline) - Date.parse(new Date()),
        days = Math.floor(time / (1000 * 60 * 60 * 24) % 30),
        hours = Math.floor((time / (1000 * 60 * 60)) % 24),
        minutes = Math.floor((time / (1000 * 60)) % 60),
        seconds = Math.floor((time / 1000) % 60);
        return {
            'total':time,
            'days':days,
            'hours':hours,
            'minutes':minutes,
            'seconds':seconds
        }
    };
    function getZeroNum(num){
        if (num <10){
            return `0${num}`
        }else{
            return num
        }
    };
    function setTime(selector, endtime){
        const timer = document.querySelector(selector),
        days = timer.querySelector('#days'),
        hours = timer.querySelector('#hours'),
        minutes = timer.querySelector('#minutes'),
        seconds = timer.querySelector('#seconds'),
        tt = setInterval(updateTime, 1000);
        function updateTime(){
            const t = getTime(endtime);
            days.innerHTML = getZeroNum(t.days);
            hours.innerHTML = getZeroNum(t.hours);
            minutes.innerHTML = getZeroNum(t.minutes);
            seconds.innerHTML = getZeroNum(t.seconds);
            if(t.total<=0){
                clearInterval(tt);
            }
        }
    }
   setTime('.timer', deadline);
   //modal
   const modal = document.querySelector('.modal'),
   btns = document.querySelectorAll('[data-modal]')
   function closeModal(){
        modal.style.display='none';
        document.body.style.overflowY='';
   }
   function openModal(){
        modal.style.display='block';
        document.body.style.overflowY='hidden';
   }
   btns.forEach(button=>{
    button.addEventListener('click', openModal)
    });
    modal.addEventListener('click', (e)=>{
        if (e.target===modal || e.target.getAttribute('data-close')==''){
            closeModal();
        }
    })
    document.addEventListener('keydown', (e)=>{
        if (e.code === 'Escape' && modal.style.display=='block'){
            closeModal()
        }
    });
    //classes

    class Menu_Widget{
        constructor(src, alt, title, descr, price, parentSelector, ...classes){
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr; 
            this.price = price;
            this.classes = classes; 
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH(){
            return this.price*=this.transfer;
        }
        render(){
            const div = document.createElement('div');
            if  (this.classes.length === 0){
                this.divclass = 'menu__item';
                div.classList.add(this.divclass) 
            }else{
                this.classes.forEach(className => div.classList.add(className));
            }
            this.classes.forEach(className => div.classList.add(className));
            div.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `;
            this.parent.append(div)
        }
    };
    new Menu_Widget('img/tabs/vegy.jpg',
    'rand',
    'Меню "Фитнес"', 
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    229, 
    '.menu .container').render();
    new Menu_Widget('img/tabs/post.jpg',
    'rand',
    'Меню Постное', 
    'Меню "Постное" - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    550, 
    '.menu .container').render();
    new Menu_Widget('img/tabs/elite.jpg',
    'rand',
    'Меню Премиум', 
    'Меню "Премиум" - мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    430, 
    '.menu .container').render();


    const forms = document.querySelectorAll('form');
    forms.forEach(form=>{
        postData(form)
    })
    const message ={
        loading: 'spinner.svg',
        succes: 'Спасибо! Мы скоро с Вами свяжемся',
        failure: 'Что-то пошло не так...'
    }
    function postData(form){
        form.addEventListener('submit', (e)=>{
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display:block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'js/server.php');
            
            request.setRequestHeader('Content-type', 'application/json');
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            })

            const json = JSON.stringify(object);

            request.send(json);

            request.addEventListener('load', ()=>{
                if (request.status === 200){
                    console.log(request.response);
                    showThanksModal(message.succes);
                    form.reset();
                    statusMessage.remove()
                }else{
                    showThanksModal(message.failure);
                    console.log('error')
                }
            })
        })
    }

    function showThanksModal(message){
        
        const previousModalDialog = document.querySelector('.modal__dialog');
        previousModalDialog.classList.add('hide');
        openModal();    

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>x</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal)
        setTimeout(() => {
            thanksModal.remove();
            previousModalDialog.classList.remove('hide');
            closeModal();
        }, 4000)
    }

    fetch('db1.json')
        .then(data=>data.json())
        .then(res=>console.log(res))
});
