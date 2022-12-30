import { NIcon, NAvatar, NText } from 'naive-ui';
import { h } from 'vue';
import { Icon } from '@iconify/vue';
import { useStore } from 'vuex';

export const useRenderSortIcon = ({ order }) => {
  if (order === false) return h('div', '');
  return h(
    NIcon,
    {
      style: {
        transform: order === 'ascend' ? 'rotate(-180deg) ' : '',
        transition: '0.2s transform ease-out',
      },
    },
    { default: () => h(Icon, { icon: 'akar-icons:arrow-down' }) }
  );
};

export const useRenderCell = (value) => {
  if (!value) {
    return '--';
  }

  return value;
};

export const useRenderDropdownLabel = (option) => {
  const store = useStore();

  const iconNode = option.imageUrl
    ? h(NAvatar, {
        src: option.imageUrl,
        round: true,
        size: 'small',
        color: 'transparent',
        style: { marginRight: '12px' },
      })
    : option.icon
    ? h(Icon, {
        icon: option.icon,
        color: option.iconColor
          ? option.iconColor
          : store.state.global.isDarkMode
          ? option.iconColorDark
          : option.iconColorLight,
        width: '1.2rem',
        rotate: option.iconRotate,
        style: { marginRight: '12px' },
      })
    : null;

  let descNode;
  if (option.description) {
    descNode = h(
      NText,
      { depth: 3, tag: 'div', style: { marginLeft: '1rem' } },
      { default: () => option.description || '' }
    );
  }

  const getLabel = () => {
    if (option.pallet) {
      return `${option.pallet}.${option.name}`;
    }

    return option.name || option.label;
  };

  return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
    iconNode,
    h('div', { style: { padding: '4px 0' } }, [h('div', getLabel()), descNode]),
  ]);
};

export const renderSelectTagWithDescription = ({ option }) => {
  return h(
    'div',
    { style: { display: 'flex', alignItems: 'center' } },
    {
      default: () =>
        `${option.pallet ? `${option.pallet}.` : ''}${option.name}`,
    }
  );
};
