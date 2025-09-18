// 导航栏滚动隐藏效果
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.site-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 向下滚动且已经滚动超过导航栏高度时隐藏导航栏
        if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
            header.classList.add('hide');
        } 
        // 向上滚动时显示导航栏
        else if (scrollTop < lastScrollTop) {
            header.classList.remove('hide');
        }
        
        lastScrollTop = scrollTop;
    });
});