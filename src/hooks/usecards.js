import { useQuery, useMutation, useQueryClient } from 'react-query';
import { cardsAPI, pricesAPI } from '../services/api';

// Hook for fetching cards with search and pagination
export const useCards = (options = {}) => {
  const { 
    page = 1, 
    limit = 50,
    search = '',
    sortBy = 'name',
    sortOrder = 'asc',
    category = null
  } = options;

  return useQuery(
    ['cards', page, limit, search, sortBy, sortOrder, category],
    () => cardsAPI.getAll({ page, limit, search, sortBy, sortOrder, category }),
    {
      keepPreviousData: true,
      select: (response) => ({
        cards: response.data.data,
        pagination: response.data.pagination
      })
    }
  );
};

// Hook for fetching a single card
export const useCard = (id) => {
  return useQuery(
    ['card', id],
    () => cardsAPI.getById(id),
    {
      enabled: !!id,
      select: (response) => response.data.data
    }
  );
};

// Hook for creating a card
export const useCreateCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (cardData) => cardsAPI.create(cardData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cards');
      }
    }
  );
};

// Hook for updating a card
export const useUpdateCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }) => cardsAPI.update(id, data),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['card', variables.id]);
        queryClient.invalidateQueries('cards');
      }
    }
  );
};

// Hook for deleting a card
export const useDeleteCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id) => cardsAPI.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cards');
      }
    }
  );
};

// Hook for bulk updating cards
export const useBulkUpdateCards = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (cardsData) => cardsAPI.bulkUpdate(cardsData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cards');
      }
    }
  );
};

// Hook for toggling card price visibility
export const useToggleCardPriceVisibility = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ cardIds, showBuyPrice, showSellPrice }) => 
      cardsAPI.toggleVisibility(cardIds, { showBuyPrice, showSellPrice }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cards');
      }
    }
  );
};

// Hook for updating a price
export const useUpdatePrice = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, priceData }) => pricesAPI.update(id, priceData),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['card']);
      }
    }
  );
};

// Hook for bulk updating prices
export const useBulkUpdatePrices = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (pricesData) => pricesAPI.bulkUpdate(pricesData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['card']);
      }
    }
  );
};

// Hook for toggling price visibility
export const useTogglePriceVisibility = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ priceIds, showBuyPrice, showSellPrice }) => 
      pricesAPI.toggleVisibility(priceIds, { showBuyPrice, showSellPrice }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['card']);
      }
    }
  );
};
