import { NIcon, NAvatar, NText } from 'naive-ui';
import { h } from 'vue';
import { Icon } from '@iconify/vue';

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
  const iconNode = option.img_url
    ? h(NAvatar, {
        src: option.img_url,
        round: true,
        size: 'small',
        color: 'white',
        style: { marginRight: '12px' },
      })
    : option.icon
    ? h(Icon, {
        icon: option.icon,
        color: option.iconColor,
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

  return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
    iconNode,
    h('div', { style: { padding: '4px 0' } }, [
      h('div', option.name || option.label),
      descNode,
    ]),
  ]);
};

export const renderSelectTagWithDescription = ({ option }) => {
  return h(
    'div',
    { style: { display: 'flex', alignItems: 'center' } },
    option.name
  );
};
