import styles from './Footer.module.scss'

const Footer = () => {
  return (
    <footer>
      <div className={styles.footerItem}>
        <h3>Есть вопросы?</h3>
        <p>Звоните и мы с радостью на них ответим</p>
        <p className={styles.number}>+7 (707) 582 30 10</p>
      </div>
      <div className={styles.footerItem}>
        <h3>Соц сети</h3>
        <p>Подписывайтесь на наш канал и будьте в курсе последних новостей.</p>
        <div className={styles.socileIcons}>
          <a href="https://youtube.com/">
            <img src="/images/youtube_photo.png" alt="" />
          </a>
          <a href="https://t.me/c/2228400264/2">
            <img src="/images/vk_photo.png" alt="" />
          </a>
        </div>
      </div>
      <div className={styles.footerItem}>
        <h3>Мобильное приложение</h3>
        <p>Скачайте наше мобильное приложение для удобства. Всегда под рукой, всегда рядом</p>
        <a href="https://youtube.com/"></a>
        <a href="https://t.me/c/2228400264/2"></a>
      </div>
    </footer>
  )
}

export default Footer
