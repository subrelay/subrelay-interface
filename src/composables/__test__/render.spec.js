import { shallowMount, config } from '@vue/test-utils';
import { vi } from 'vitest';
import {
  useRenderSortIcon,
  useRenderDropdownLabel,
  renderSelectTagWithDescription,
  useRenderIcon,
  useGetChannelIcon,
  useGetChainImg,
} from '@/composables';
import { globalComponents } from '../../test/setup';

config.global.components = globalComponents;

// Mock dependencies
vi.mock('vuex', () => ({
  useStore: vi.fn(() => ({
    state: {
      global: {
        isDarkMode: true,
      },
    },
  })),
}));

describe('Composable for render', () => {
  describe('useRenderSortIcon', () => {
    it('should render the sort icon in ascending order', () => {
      const wrapper = shallowMount({
        render() {
          return useRenderSortIcon({ order: 'ascend' });
        },
      });

      expect(wrapper.html()).toContain('rotate(-180deg)');
    });

    it('should render an empty div when the order is false', () => {
      const wrapper = shallowMount({
        render() {
          return useRenderSortIcon({ order: false });
        },
      });

      expect(wrapper.html()).toContain('<div></div>');
    });
  });

  describe('useRenderDropdownLabel', () => {
    it('should render the dropdown label with an image avatar', () => {
      const option = { imageUrl: 'avatar.jpg' };

      const wrapper = shallowMount({
        render() {
          return useRenderDropdownLabel(option);
        },
      });

      expect(wrapper.findComponent({ name: 'NAvatar'}).exists()).toBe(true);
    });

    it('should render the dropdown label with an icon', () => {
      const option = { icon: 'icon1' };

      const wrapper = shallowMount({
        render() {
          return useRenderDropdownLabel(option);
        },
      });

      expect(wrapper.findComponent({ name: 'Icon' }).exists()).toBe(true);
    });

    it('should render the dropdown label without an icon', () => {
      const option = { icon: null };

      const wrapper = shallowMount({
        render() {
          return useRenderDropdownLabel(option);
        },
      });

      expect(wrapper.findComponent({ name: 'Icon' }).exists()).toBe(false);
    });

    it('should render the dropdown label with a description', () => {
      const option = { description: 'Description' };

      const wrapper = shallowMount({
        render() {
          return useRenderDropdownLabel(option);
        },
      });

      expect(wrapper.findComponent({ name: 'NText' }).exists()).toBe(true);
    });

    it('should render the dropdown label without a description', () => {
      const option = { description: null };

      const wrapper = shallowMount({
        render() {
          return useRenderDropdownLabel(option);
        },
      });

      expect(wrapper.findComponent({ name: 'NText' }).exists()).toBe(false);
    });
  });

  describe('renderSelectTagWithDescription', () => {
    it('should render the select tag label with a description', () => {
      const option = { pallet: 'pallet', name: 'name' };

      const wrapper = shallowMount({
        render() {
          return renderSelectTagWithDescription({ option });
        },
      });

      expect(wrapper.text()).toContain('pallet.name');
    });

    it('should render the select tag label without a description', () => {
      const option = { name: 'name' };

      const wrapper = shallowMount({
        render() {
          return renderSelectTagWithDescription({ option });
        },
      });

      expect(wrapper.text()).toContain('name');
    });
  });

  describe('useRenderIcon', () => {
    it('should render an icon', () => {
      const wrapper = shallowMount({
        render() {
          return useRenderIcon('icon1')();
        },
      });

      expect(wrapper.findComponent({ name: 'Icon' }).exists()).toBe(true);
    });
  });

  describe('useGetChannelIcon', () => {
    it('should return the channel icon for a valid channel name', () => {
      expect(useGetChannelIcon('email')).toBe('fluent-emoji-flat:e-mail');
      expect(useGetChannelIcon('webhook')).toBe('logos:webhooks');
      expect(useGetChannelIcon('telegram')).toBe('logos:telegram');
      expect(useGetChannelIcon('discord')).toBe('logos:discord-icon');
    });

    it('should return an empty string for an invalid channel name', () => {
      expect(useGetChannelIcon('invalidChannel')).toBe(undefined);
    });
  });

  describe('useGetChainImg', () => {
    const chainsData = [
      { name: 'chain1', imageUrl: 'chain1.jpg' },
      { name: 'chain2', imageUrl: 'chain2.jpg' },
    ];

    it('should return the chain image URL for a valid chain name', () => {
      expect(useGetChainImg('chain1', chainsData)).toBe('chain1.jpg');
      expect(useGetChainImg('chain2', chainsData)).toBe('chain2.jpg');
    });

    it('should return an empty string for an invalid chain name', () => {
      expect(useGetChainImg('invalidChain', chainsData)).toBe('');
    });
  });
});
