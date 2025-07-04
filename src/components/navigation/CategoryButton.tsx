import { cx } from 'flairup';
import * as React from 'react';

import { ClassNames } from '../../DomUtils/classNames';
import {
  commonInteractionStyles,
  darkMode,
  stylesheet,
} from '../../Stylesheet/stylesheet';
import {
  CategoryConfig,
  categoryNameFromCategoryConfig,
} from '../../config/categoryConfig';
import { Button } from '../atoms/Button';

import SVGNavigation from './svg/CategoryNav.svg';

type Props = {
  isActiveCategory: boolean;
  category: string;
  allowNavigation: boolean;
  onClick: () => void;
  categoryConfig: CategoryConfig;
};

export function CategoryButton({
  isActiveCategory,
  category,
  allowNavigation,
  categoryConfig,
  onClick,
}: Props) {
  const isCustomCategory = categoryConfig.category.startsWith('custom_');

  return (
    <Button
      tabIndex={allowNavigation ? 0 : -1}
      className={cx(
        styles.catBtn,
        commonInteractionStyles.categoryBtn,
        `epr-icn-${category}`,
        {
          [ClassNames.active]: isActiveCategory,
        },
      )}
      style={
        isCustomCategory
          ? categoryConfig.imageUrl
            ? {
                backgroundImage: `url(${categoryConfig.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '50%',
                backgroundColor: 'var(--epr-custom-category-icon-bg-color)',
              }
            : {
                backgroundImage: 'none',
                backgroundColor: 'var(--epr-custom-category-icon-bg-color)',
                borderRadius: '50%',
              }
          : {}
      }
      onClick={onClick}
      aria-label={categoryNameFromCategoryConfig(categoryConfig)}
      aria-selected={isActiveCategory}
      role="tab"
      aria-controls="epr-category-nav-id"
    >
      {isCustomCategory && !categoryConfig.imageUrl ? (
        <div className={cx(styles.acronym)}>
          {categoryConfig.acronym?.substring(0, 2)}
        </div>
      ) : null}
    </Button>
  );
}

const DarkActivePositionY = {
  backgroundPositionY: 'calc(var(--epr-category-navigation-button-size) * 3)',
};
const DarkPositionY = {
  backgroundPositionY: 'calc(var(--epr-category-navigation-button-size) * 2)',
};

const DarkInactivePosition = {
  ':not(.epr-search-active)': {
    catBtn: {
      ':hover': DarkActivePositionY,
      '&.epr-active': DarkActivePositionY,
    },
  },
};

const styles = stylesheet.create({
  acronym: {
    '.': 'epr-acronym',
    fontSize: 'var(--epr-category-navigation-acronym-font-size)',
    fontWeight: 'var(--epr-category-navigation-acronym-font-weight)',
    textAlign: 'center',
    color: 'var(--epr-text-color)',
    height: 'var(--epr-category-navigation-button-size)',
    display: 'grid',
    placeItems: 'center',
    lineHeight: '1em',
  },
  catBtn: {
    '.': 'epr-cat-btn',
    marginBottom: 'var(--epr-category-gap)',
    display: 'inline-block',
    transition: 'opacity 0.2s ease-in-out',
    position: 'relative',
    height: 'var(--epr-category-navigation-button-size)',
    width: 'var(--epr-category-navigation-button-size)',
    backgroundSize: 'calc(var(--epr-category-navigation-button-size) * 10)',
    outline: 'none',
    backgroundPosition: '0 0',
    backgroundImage: `url(${SVGNavigation})`,
    ':focus:before': {
      content: '',
      position: 'absolute',
      top: '-2px',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      border: '2px solid var(--epr-category-icon-active-color)',
      borderRadius: '50%',
    },
    '&.epr-icn-suggested': {
      backgroundPositionX:
        'calc(var(--epr-category-navigation-button-size) * -8)',
    },
    '&.epr-icn-custom': {
      backgroundPositionX:
        'calc(var(--epr-category-navigation-button-size) * -9)',
    },
    '&.epr-icn-activities': {
      backgroundPositionX:
        'calc(var(--epr-category-navigation-button-size) * -4)',
    },
    '&.epr-icn-animals_nature': {
      backgroundPositionX:
        'calc(var(--epr-category-navigation-button-size) * -1)',
    },
    '&.epr-icn-flags': {
      backgroundPositionX:
        'calc(var(--epr-category-navigation-button-size) * -7)',
    },
    '&.epr-icn-food_drink': {
      backgroundPositionX:
        'calc(var(--epr-category-navigation-button-size) * -2)',
    },
    '&.epr-icn-objects': {
      backgroundPositionX:
        'calc(var(--epr-category-navigation-button-size) * -5)',
    },
    '&.epr-icn-smileys_people': {
      backgroundPositionX: '0px',
    },
    '&.epr-icn-symbols': {
      backgroundPositionX:
        'calc(var(--epr-category-navigation-button-size) * -6)',
    },
    '&.epr-icn-travel_places': {
      backgroundPositionX:
        'calc(var(--epr-category-navigation-button-size) * -3)',
    },
  },
  ...darkMode('catBtn', DarkPositionY),
  '.epr-dark-theme': {
    ...DarkInactivePosition,
  },
  '.epr-auto-theme': {
    ...DarkInactivePosition,
  },
});
