import { cx } from 'flairup';
import * as React from 'react';

import { ClassNames } from '../../DomUtils/classNames';
import { stylesheet } from '../../Stylesheet/stylesheet';
import {
  Categories,
  CategoryConfig,
  categoryFromCategoryConfig,
} from '../../config/categoryConfig';
import {
  useCategoriesConfig,
  useEmojiStyleConfig,
  useGetEmojiUrlConfig,
  useLazyLoadEmojisConfig,
  useSkinTonesDisabledConfig,
  useStyleConfig,
} from '../../config/useConfig';
import { emojisByCategory, emojiUnified } from '../../dataUtils/emojiSelectors';
import { useIsEmojiDisallowed } from '../../hooks/useDisallowedEmojis';
import { useIsEmojiHidden } from '../../hooks/useIsEmojiHidden';
import {
  useActiveSkinToneState,
  useIsPastInitialLoad,
} from '../context/PickerContext';
import { ClickableEmoji } from '../emoji/Emoji';

import { EmojiCategory } from './EmojiCategory';
import { Suggested } from './Suggested';
import { CategoryNavigation } from '../navigation/CategoryNavigation';

export function EmojiList() {
  const categories = useCategoriesConfig();
  const renderdCategoriesCountRef = React.useRef(0);
  const style = useStyleConfig();
  const { height } = style || {};

  return (
    <div className={cx(styles.row)}>
      <div
        className={cx(styles.navigationContainer)}
        style={{
          // Hide scrollbar
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          maxHeight: `calc(${height} - var(--epr-emoji-variation-picker-height) - var(--epr-horizontal-padding) * 2 - var(--epr-preview-height))`,
        }}
      >
        <CategoryNavigation />
      </div>
      <div className={cx(styles.emojiListContainer)}>
        <ul className={cx(styles.emojiList)}>
          {categories.map((categoryConfig) => {
            const category = categoryFromCategoryConfig(categoryConfig);

            if (category === Categories.SUGGESTED) {
              return (
                <Suggested key={category} categoryConfig={categoryConfig} />
              );
            }

            return (
              <React.Suspense key={category}>
                <RenderCategory
                  category={category}
                  categoryConfig={categoryConfig}
                  renderdCategoriesCountRef={renderdCategoriesCountRef}
                />
              </React.Suspense>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function RenderCategory({
  category,
  categoryConfig,
  renderdCategoriesCountRef,
}: {
  category: Categories;
  categoryConfig: CategoryConfig;
  renderdCategoriesCountRef: React.MutableRefObject<number>;
}) {
  const isEmojiHidden = useIsEmojiHidden();
  const lazyLoadEmojis = useLazyLoadEmojisConfig();
  const emojiStyle = useEmojiStyleConfig();
  const isPastInitialLoad = useIsPastInitialLoad();
  const [activeSkinTone] = useActiveSkinToneState();
  const isEmojiDisallowed = useIsEmojiDisallowed();
  const getEmojiUrl = useGetEmojiUrlConfig();
  const showVariations = !useSkinTonesDisabledConfig();

  // Small trick to defer the rendering of all emoji categories until the first category is visible
  // This way the user gets to actually see something and not wait for the whole picker to render.
  const emojisToPush =
    !isPastInitialLoad && renderdCategoriesCountRef.current > 0
      ? []
      : emojisByCategory(category);

  if (emojisToPush.length > 0) {
    renderdCategoriesCountRef.current++;
  }

  let hiddenCounter = 0;

  const emojis = emojisToPush.map((emoji) => {
    const unified = emojiUnified(emoji, activeSkinTone);
    const { failedToLoad, filteredOut, hidden } = isEmojiHidden(emoji);

    const isDisallowed = isEmojiDisallowed(emoji);

    if (hidden || isDisallowed) {
      hiddenCounter++;
    }

    if (isDisallowed) {
      return null;
    }

    return (
      <ClickableEmoji
        showVariations={showVariations}
        key={unified}
        emoji={emoji}
        unified={unified}
        hidden={failedToLoad}
        hiddenOnSearch={filteredOut}
        emojiStyle={emojiStyle}
        lazyLoad={lazyLoadEmojis}
        getEmojiUrl={getEmojiUrl}
      />
    );
  });

  return (
    <EmojiCategory
      categoryConfig={categoryConfig}
      // Indicates that there are no visible emojis
      // Hence, the category should be hidden
      hidden={hiddenCounter === emojis.length}
    >
      {emojis}
    </EmojiCategory>
  );
}

const styles = stylesheet.create({
  emojiList: {
    '.': ClassNames.emojiList,
    listStyle: 'none',
    margin: '0',
    padding: '0',
    flex: '1',
  },
  emojiListContainer: {
    '.': ClassNames.scrollBody,
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  navigationContainer: {
    position: 'sticky',
    top: '0',
    left: '0',
    bottom: '0',
    width: 'var(--epr-category-navigation-width)',
    overflowY: 'auto',
    '::webkit-scrollbar': {
      display: 'none',
    },
  },
  row: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
  },
});
