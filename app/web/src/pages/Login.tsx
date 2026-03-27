import styles from './Login.module.css'

export default function Login() {
  return (
    <div className={styles.page}>


      <div className={styles.logo}>logo</div>

      {/* welcome title */}
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Welcome Back</h1>
        <svg width="34" height="55" viewBox="0 0 39 61" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.5613 4.75128C11.5613 9.08789 10.571 20.3496 8.87909 24.5587C7.23105 28.6587 3.44331 31.7538 2.67801 33.0706C1.30983 35.4246 8.30137 33.7571 9.98575 34.8169C13.9526 37.3127 16.6782 44.4786 17.8112 51.7394C18.14 53.8467 17.9387 56.4681 17.9387 57.0645C17.9387 60.4768 19.0566 49.663 23.7909 43.7283C30.2068 35.6856 35.8141 35.8916 36.3806 35.267C36.9719 34.6151 32.2203 33.0293 27.5385 29.4749C23.971 25.7966 20.5835 18.8078 17.7699 10.127C16.8133 6.52194 16.8133 4.5412 16.4381 2.50044" stroke="black" strokeWidth="5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* form */}
      <div className={styles.form}>

        {/* email box */}
        <p className={styles.label}>Email address (.edu)</p>
        <input className={styles.input} type="email" placeholder="" />

        {/* password box */}
        <div className={styles.passwordRow}>
          <p className={styles.label}>Password</p>
          <span className={styles.forgot}>Forgot?</span>
        </div>
        <input className={styles.input} type="password" placeholder="" />

        {/* login btn*/}
        <button className={styles.loginButton}>Log in</button>

        {/* sign up btn */}
        <p className={styles.signupText}>
          Don't have an account? <span className={styles.signupLink}>Sign up</span>
        </p>

      </div>
    </div>
  )
}