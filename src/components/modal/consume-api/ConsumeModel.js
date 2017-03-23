import {List} from 'immutable'
import {Fragment} from "./Fragment";

export type ConsumeState = {
  fragments: List<Fragment>,
  isOpen: boolean,
  query: string,
  isSearching: boolean,
  isSubmitting: boolean,
  isAddingMore: boolean,
  noMoreFragments: boolean,
  error: string
}