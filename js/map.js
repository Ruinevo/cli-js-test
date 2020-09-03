window.map = () => {
  const apps = document.querySelectorAll('[data-script="map"]')
  const { yandexMap, ymapMarker } = window['vue-yandex-maps']

  apps.forEach(item => {
    const content = JSON.parse(item.dataset.scriptContent)

    new Vue({
      el: item,
      components: {
        yandexMap,
        ymapMarker
      },
      template: `<div class="cli-map-content">
        <yandexMap
        :settings="settings"
        :coords="coords"
        :zoom="zoom"
        :controls="controls"
        :options="options"
      >
        <ymapMarker
          v-for="mark in points"
          :key="mark.name"
          :coords="mark.coords"
          :markerId="mark.id"
          :balloon-template="getBalloonTemplate(mark)"
          :icon="markerIcon"
        />
      </yandexMap>
    </div>`,
      data() {
        return {
          ...content,
          options: {
            suppressMapOpenBlock: true
          },
          markerIcon: {
            layout: 'default#imageWithContent',
            imageHref: '',
            imageSize: [24, 24],
            imageOffset: [0, 0],
            contentOffset: [0, 0],
            contentLayout: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
              '<circle cx="12" cy="12" r="12" fill="#5552E8"/>\n' +
              '<circle cx="12" cy="12" r="3" fill="white"/>\n' +
              '</svg>\n'
          }
        }
      },
      methods: {
        getBalloonTemplate(mark) {
          return `
            <h1>${mark.title}</h1>
            <p>${mark.subtitle}</p>
            <p>${mark.name}</p>
            <p>${mark.coords}</p>
          `
        }
      }
    })
  })
}



