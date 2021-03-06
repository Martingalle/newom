class OpinionsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]
  before_action :set_opinion, only: [:show, :update, :destroy]

  def index
    # ---------------------------------------------------------
    # USER STORIES
    # - displaying opinions informations
    # - displaying random opinions
    # - creating a new opinion
    # ---------------------------------------------------------

    @opinions = policy_scope(Opinion).order(created_at: :desc)
    @random_opinions = @opinions.sample(6)
    if params[:query].present?
      @genre_query = Genre.where(name: params[:query]).first
      @opinions = @opinions.select do |opinion|
        opinion.all_genres.include? @genre_query
      end
    end
    @genres = Genre.all
    @searchable_genres = []
    Opinion.all.each do |opinion|
      opinion.all_genres.each do |genre|
        @searchable_genres << genre
      end
    end
    @searchable_genres = @searchable_genres.uniq
    @opinion_new = Opinion.new
  end

  def show
    # ---------------------------------------------------------
    # before_action => set_opinion => @opinion
    # ---------------------------------------------------------
    # USER STORIES
    # - displaying opinion informations
    # - displaying tracks replying to the opinion
    # - displaying opinions related to the opinion
    # - creating a new track to reply to the opinion
    # - upvoting on a track
    # - downvoting on a track
    # ---------------------------------------------------------
    # ! if the opinion has just been created by the user, instantly suggest to create a track
    # ---------------------------------------------------------
    @track_new = Track.new
    @new = params[:new] || false # will be 'true' if the opinion has just been created
    @youtube_ids = @opinion.tracks.pluck(:youtube_id)
    @tracks_desc = @opinion.tracks.order(created_at: :desc)
  end

  def create
    # ---------------------------------------------------------
    # USER STORIES
    # - creating a new opinion
    # ---------------------------------------------------------
    @opinion_new = Opinion.new(opinion_params)
    authorize @opinion_new
    @opinion_new.creator = current_user
    #@new = true
    if @opinion_new.save
      @track_new = Track.new
      redirect_to opinion_path(@opinion_new, new: true)
    else
      render_index
    end
  end

  # ! admin only
  def update
    if @opinion.update(opinion_params)
      redirect_to opinion_path(@opinion)
    else
      render_show
    end
  end

  # ! admin only
  def destroy
    if @opinion.destroy
      redirect_to opinions_path
    else
      render_show
    end
  end

  private

  def set_opinion
    @opinion = Opinion.find(params[:id])
    authorize @opinion
  end

  def opinion_params
    params.require(:opinion).permit(:name, :description, :genre_id)
  end

  def render_show
    @track_new = Track.new
    @new = params[:new] || false
    @opinion = Opinion.find(params[:id])
    @youtube_ids = @opinion.tracks.pluck(:youtube_id)
    @tracks_desc = @opinion.tracks.order(created_at: :desc)
    render :show
  end

  def render_index
    @opinions = policy_scope(Opinion).order(created_at: :desc)
    @random_opinions = @opinions.sample(6)
    if params[:query].present?
      @genre_query = Genre.where(name: params[:query]).first
      @opinions = @opinions.select do |opinion|
        opinion.all_genres.include? @genre_query
      end
    end
    @genres = Genre.all
    @searchable_genres = []
    Opinion.all.each do |opinion|
      opinion.all_genres.each do |genre|
        @searchable_genres << genre
      end
    end
    @searchable_genres = @searchable_genres.uniq
    render :index
  end
end
