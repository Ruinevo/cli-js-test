const slider = () => {

    console.time('pre')

    const apps = document.querySelectorAll('[data-script="slider"]')

    const getClassName = (selector) => {
        if (selector.startsWith('.')) {
            return selector.slice(1)
        }
        return selector
    }



    apps.forEach(item => {

        console.time('pre')

        const options = JSON.parse(item.dataset.sliderOptions)

        options.preloadImages = false
        options.lazy = true


        const prevSelector = options.navigation.prevEl
        const nextSelector = options.navigation.nextEl
        const paginationSelector = options.pagination.el

        const prevBtn = item.querySelector(`[data-navigation]${prevSelector}`)
        const nextBtn = item.querySelector(`[data-navigation]${nextSelector}`)

        const pagination = item.querySelector(`[data-pagination]${paginationSelector}`)

        prevBtn.setAttribute('slot', 'button-prev')
        nextBtn.setAttribute('slot', 'button-next')



        const slides = Array.from(item.querySelectorAll('[data-slide]')).map(slide => {
            const parentDataset = slide.dataset.wrapper
            if (parentDataset !== undefined) return `<swiper-slide data-element="${parentDataset}">${slide.outerHTML}</swiper-slide>`
            return `<swiper-slide>${slide.outerHTML}</swiper-slide>`
        })


        if (pagination) {
            options.pagination.renderBullet = (index, className) => pagination.querySelector('span').outerHTML
        }


        Vue.use(VueAwesomeSwiper)

        new Vue({
            el: item,
            template: `
      <div :style="{ opacity: loaded ? 1 : 0 }" class="${item.className}"><swiper :options="swiperOptions" @ready="loaded = true">
                  ${slides.join('\n')}
                  <div v-if="paginationEl" class="${getClassName(paginationSelector)}" slot="pagination"></div>
                  ${prevBtn.outerHTML}
                  ${nextBtn.outerHTML}
                </swiper>
            </div>`,
            data: {
                swiperOptions: options,
                paginationEl: pagination,
                loaded: false
            }
        })

    })
    console.timeEnd('pre')
}

if (window.constructorCliFunc) {
    window.constructorCliFunc.slider = slider
} else {
    const constructorCliFunc = { slider }
    window.constructorCliFunc = constructorCliFunc
}
