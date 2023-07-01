import { NIcon, NAvatar, NText } from 'naive-ui';
import { h } from 'vue';
import { Icon } from '@iconify/vue';
import { useStore } from 'vuex';
import channels from '@/config/channels';

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
    { default: () => h(Icon, { icon: 'akar-icons:arrow-down' }) },
  );
};

export const useRenderDropdownLabel = (option) => {
  const store = useStore();

  let iconNode;
  if (option.imageUrl) {
    iconNode = h(NAvatar, {
      src: option.imageUrl,
      round: true,
      size: 'small',
      color: 'transparent',
      style: { marginRight: '12px' },
    });
  } else if (option.icon) {
    let color;

    if (option.iconColor) {
      color = option.iconColor;
    } else if (store.state.global.isDarkMode) {
      color = option.iconColorDark;
    } else {
      color = option.iconColorLight;
    }

    iconNode = h(Icon, {
      icon: option.icon,
      color,
      width: '1.2rem',
      rotate: option.iconRotate,
      style: { marginRight: '12px' },
    });
  } else {
    iconNode = null;
  }

  let descNode;

  if (option.description) {
    descNode = h(
      NText,
      { depth: 3, tag: 'div', style: { marginLeft: '1rem' } },
      { default: () => option.description || '' },
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
  const tag = h(
    'div',
    { style: { display: 'flex', alignItems: 'center' } },
    {
      default: () => `${option.pallet ? `${option.pallet}.` : ''}${option.name}`,
    },
  );
  return tag;
};

export const useRenderIcon = (icon) => () => h(Icon, { icon, inline: true });

export function useGetChannelIcon(channelName) {
  const channel = channels.find((el) => el.value === channelName) || {};
  return channel.icon;
}

export function useGetChainImg(chainName, chainsData) {
  const chain = chainsData.find((el) => el.name === chainName) || {};
  return chain.imageUrl || '';
}
