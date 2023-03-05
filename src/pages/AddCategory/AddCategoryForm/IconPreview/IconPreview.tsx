import { useEffect, useState } from 'react';
import styles from './IconPreview.module.scss';
import stylesImgError from 'assets/styles/imgError.module.scss';


interface Props {
  name: string,
  icon: string,
}

const IconPreview = (props: Props) => {
  const { name, icon } = props;
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    resetImg();
  }, [icon]);
  
  const resetImg = () => {
    setImgError(false);
    const imgHTML = document.querySelector(`.${styles.iconPreview}`);
    if(imgHTML) imgHTML.classList.remove(stylesImgError.imgError);
  };

  return (
    <div>
      {
        icon && icon.length > 0
          ? (
            <>
              <img className={styles.iconPreview} src={icon} alt="icon of the category"
                onError={({ currentTarget }) => {
                  currentTarget.src = '';
                  currentTarget.className = `${styles.iconPreview} ${stylesImgError.imgError}`;
                  setImgError(true);
                }}
              />
              {
                imgError
                  ? name && name.length > 0
                    ? <span className={styles.iconPreview__iconText}>{name[0]}</span>
                    : <span className={`${styles.iconPreview__iconText} ${styles.error}`}>error</span>
                  : null
              }
            </>
          )
          : name && name.length > 0
            ? <span className={styles.iconPreview__iconText}>{name[0]}</span>
            : null
      }
    </div>
  );
};

export default IconPreview;